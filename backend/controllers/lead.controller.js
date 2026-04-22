const Lead = require("../models/Lead.model");

// ── Helpers ───────────────────────────────────────────────────────────────────
const buildQuery = (queryParams) => {
  const { status, source, search, archived } = queryParams;
  const filter = {};

  filter.isArchived = archived === "true" ? true : false;
  if (status && status !== "all") filter.status = status;
  if (source && source !== "all") filter.source = source;
  if (search) {
    // Use MongoDB text index for full-text search
    filter.$text = { $search: search };
  }
  return filter;
};

// ── GET /api/leads ────────────────────────────────────────────────────────────
const getLeads = async (req, res, next) => {
  try {
    const { sort = "newest", page = 1, limit = 10 } = req.query;
    const filter = buildQuery(req.query);

    // Sort mapping
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      followup: { followUpDate: 1 },
      name: { name: 1 },
    };
    const sortOrder = sortMap[sort] || sortMap.newest;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(filter);

    const leads = await Lead.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(Number(limit))
      .select("-notes -activity") // Exclude heavy subdocs from list view
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      leads,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/leads/stats ──────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [stats] = await Lead.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } },
        },
      },
    ]);

    // Source breakdown
    const sourceBreakdown = await Lead.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Upcoming follow-ups (next 7 days)
    const now = new Date();
    const next7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingFollowUps = await Lead.find({
      followUpDate: { $gte: now, $lte: next7 },
      isArchived: false,
    })
      .select("name company followUpDate status")
      .sort({ followUpDate: 1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      stats: stats || { total: 0, new: 0, contacted: 0, converted: 0 },
      sourceBreakdown,
      upcomingFollowUps,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/leads ───────────────────────────────────────────────────────────
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, message, followUpDate } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      source: source || "Website",
      message,
      followUpDate: followUpDate || null,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/leads/:id ────────────────────────────────────────────────────────
const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    res.status(200).json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/leads/:id ────────────────────────────────────────────────────────
const updateLead = async (req, res, next) => {
  try {
    const allowedFields = ["name", "email", "phone", "company", "source", "message", "followUpDate"];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    // Log activity
    updates.$push = {
      activity: { text: "Lead details updated", type: "updated" },
    };

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });

    res.status(200).json({ success: true, message: "Lead updated", lead });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/leads/:id/status ───────────────────────────────────────────────
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "contacted", "converted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status,
        lastContactedAt: new Date(),
        $push: {
          activity: {
            text: `Status changed to "${status}"`,
            type: "status_change",
            meta: { from: null, to: status },
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });

    res.status(200).json({ success: true, message: `Status updated to ${status}`, lead });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/leads/:id/notes ─────────────────────────────────────────────────
const addNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Note text is required." });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: { text: text.trim(), author: req.admin?.name || "Admin", authorId: req.admin?._id },
          activity: { text: "Note added", type: "note_added" },
        },
      },
      { new: true }
    );

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });

    const newNote = lead.notes[lead.notes.length - 1];
    res.status(201).json({ success: true, message: "Note added", note: newNote, lead });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/leads/:id ─────────────────────────────────────────────────────
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });

    res.status(200).json({ success: true, message: "Lead deleted successfully." });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/leads/export ─────────────────────────────────────────────────────
const exportCSV = async (req, res, next) => {
  try {
    const leads = await Lead.find({ isArchived: false }).select("-notes -activity").lean();

    const headers = ["Name", "Email", "Phone", "Company", "Source", "Status", "Follow-up Date", "Last Contacted", "Created At"];
    const rows = leads.map((l) => [
      l.name, l.email, l.phone || "", l.company || "",
      l.source, l.status,
      l.followUpDate ? new Date(l.followUpDate).toLocaleDateString() : "",
      l.lastContactedAt ? new Date(l.lastContactedAt).toLocaleDateString() : "",
      new Date(l.createdAt).toLocaleDateString(),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));

    const csv = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="leads-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeads, getStats, createLead, getLead, updateLead, updateStatus, addNote, deleteLead, exportCSV };

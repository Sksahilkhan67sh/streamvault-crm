const mongoose = require("mongoose");

// ── Note sub-schema ───────────────────────────────────────────────────────────
const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Note text is required"],
      trim: true,
      maxlength: [2000, "Note cannot exceed 2000 characters"],
    },
    author: {
      type: String,
      default: "Admin",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

// ── Activity sub-schema ───────────────────────────────────────────────────────
const activitySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["created", "status_change", "note_added", "updated", "followup_set"],
      default: "updated",
    },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// ── Main Lead schema ──────────────────────────────────────────────────────────
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone cannot exceed 20 characters"],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    source: {
      type: String,
      enum: ["Website", "LinkedIn", "Referral", "Cold Email", "Social Media", "Event", "Other"],
      default: "Website",
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
    notes: [noteSchema],
    activity: [activitySchema],
    followUpDate: {
      type: Date,
      default: null,
    },
    lastContactedAt: {
      type: Date,
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt automatically
  }
);

// ── Indexes for performance ───────────────────────────────────────────────────
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ followUpDate: 1 });
leadSchema.index({ name: "text", email: "text", company: "text" }); // Full-text search

// ── Middleware: log initial activity on create ────────────────────────────────
leadSchema.pre("save", function (next) {
  if (this.isNew) {
    this.activity.push({
      text: `Lead created from ${this.source}`,
      type: "created",
    });
  }
  next();
});

module.exports = mongoose.model("Lead", leadSchema);

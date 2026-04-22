const express = require("express");
const { body, param } = require("express-validator");
const {
  getLeads, getStats, createLead, getLead,
  updateLead, updateStatus, addNote, deleteLead, exportCSV,
} = require("../controllers/lead.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const router = express.Router();

// ── Reusable validators ───────────────────────────────────────────────────────
const leadValidators = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("phone").optional().trim().isLength({ max: 20 }),
  body("company").optional().trim().isLength({ max: 100 }),
  body("source").optional().isIn(["Website", "LinkedIn", "Referral", "Cold Email", "Social Media", "Event", "Other"]),
  body("message").optional().trim().isLength({ max: 2000 }),
];

const idValidator = [
  param("id").isMongoId().withMessage("Invalid lead ID"),
];

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC route — website contact form (no auth required)
// POST /api/leads/contact
// ─────────────────────────────────────────────────────────────────────────────
router.post("/contact", leadValidators, validate, createLead);

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED routes — all require valid JWT
// ─────────────────────────────────────────────────────────────────────────────
router.use(protect);

// Statistics
router.get("/stats", getStats);

// CSV export
router.get("/export", exportCSV);

// CRUD
router.get("/", getLeads);
router.post("/", leadValidators, validate, createLead);
router.get("/:id", idValidator, validate, getLead);
router.put("/:id", idValidator, leadValidators, validate, updateLead);
router.delete("/:id", idValidator, validate, deleteLead);

// Status update
router.patch(
  "/:id/status",
  idValidator,
  [body("status").isIn(["new", "contacted", "converted"]).withMessage("Invalid status")],
  validate,
  updateStatus
);

// Add note
router.post(
  "/:id/notes",
  idValidator,
  [body("text").trim().notEmpty().withMessage("Note text required").isLength({ max: 2000 })],
  validate,
  addNote
);

module.exports = router;

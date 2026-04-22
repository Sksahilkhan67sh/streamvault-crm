const express = require("express");
const { body } = require("express-validator");
const { login, getMe, logout } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const router = express.Router();

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

// POST /api/auth/logout (protected)
router.post("/logout", protect, logout);

module.exports = router;

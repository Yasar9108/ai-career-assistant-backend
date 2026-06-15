const upload = require("../middlewares/upload.middleware");
const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/ai.controller")
const authMiddleware = require("../middlewares/auth.middleware");

// /api/resume/analyze 
router.post("/analyze",authMiddleware, upload.single("resume"), resumeController.generateResumeResponse);

// /api/resume/skill-gap
router.post("/skill-gap", authMiddleware, upload.single("resume"),  resumeController.generateResumeSkillGapResponse)

module.exports = router;

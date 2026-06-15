const aiServiceController = require("../controllers/ai.controller")
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();


// generate interview-questions  on route /api/ai/interview-question/generate
router.post("/generate", authMiddleware, aiServiceController.generateInterviewQuestions)

// evaluate interview answers on route /api/ai/interview-question/evaluate
router.post("/evaluate", authMiddleware, aiServiceController.eveluateInterviewAnswer)

module.exports = router





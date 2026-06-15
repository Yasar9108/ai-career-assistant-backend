const express = require('express');
const authRouter = require("./routers/auth.router");
const aiRouter = require("./routers/ai.router");
const cookieParser = require("cookie-parser");
const resumeRouter = require("./routers/resume.router");

const app = express();

app.use(express.json());
app.use(cookieParser());

// importing routes
app.use("/api/auth", authRouter);

app.use("/api/ai/interview-question", aiRouter)

app.use("/api/resume", resumeRouter);

module.exports = app;
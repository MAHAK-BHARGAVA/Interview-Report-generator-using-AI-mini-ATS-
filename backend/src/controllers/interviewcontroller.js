import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import generateInterviewReport from "../services/ai.service.js";
import InterviewReport from "../models/interviewreportmodel.js";

async function generateinterviewreportcontroller(req, res) {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({ message: "selfDescription and jobDescription are required" });
    }

    // 1. Parse PDF
    const parsedData = await pdfParse(resumeFile.buffer);
    const resumeText = parsedData.text;

    // 2. Call AI service — THIS WAS MISSING
    const aiResult = await generateInterviewReport({
      resumeText,
      selfDescription,
      jobDescription,
    });

    // 3. aiResult should have these fields — ai.service.js must return them
    const {
      matchScore,
      technicalQuestions,
      behavioralQuestions,
      skillGaps,
      preparationPlan,
      title,
    } = aiResult;

    // 4. Save to DB
    const interviewReport = await InterviewReport.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      matchScore,
      technicalQuestions,
      behavioralQuestions,
      skillGaps,
      preparationPlan,
      title,
    });

    // 5. Return — key is interviewReport (camelCase) to match your hook
    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Error generating report" });
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await InterviewReport.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("getReportById error:", error);
    res.status(500).json({ message: "Error fetching report" });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await InterviewReport.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    });

  } catch (error) {
    console.error("getAllReports error:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
}

export {
  generateinterviewreportcontroller,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
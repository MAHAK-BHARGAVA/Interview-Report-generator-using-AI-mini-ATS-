import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

console.log("TYPE:", typeof pdfParse);
console.log(process.env.GOOGLE_API_KEY);

import generateInterviewReport from "../services/ai.service.js";
import InterviewReport from "../models/interviewreportmodel.js";

async function generateinterviewreportcontroller(req, res) {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const parsedData = await pdfParse(resumeFile.buffer);

    const { selfDescription, jobDescription } = req.body;

    const interviewreportbyai = await generateInterviewReport({
      resume: parsedData.text,
      selfDescription,
      jobDescription,
    });

    const interviewreport = await InterviewReport.create({
      user: req.user.id,
      resume: parsedData.text,
      selfDescription,
      jobDescription,
      ...interviewreportbyai,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewreport,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
}

export default generateinterviewreportcontroller;
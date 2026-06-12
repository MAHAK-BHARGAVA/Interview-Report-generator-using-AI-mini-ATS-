import mongoose from "mongoose";

/**
 * - job description : string
 * - resume text : string
 * - self description : string
 * 
 * - matchscore : Number
 * 
 * -Technical questions : [
 *   {
 *     question: string,
 *     intention: string,
 *     answer: string
 *   }
 * ]
 * 
 * - Behavioral questions : [
 * {
 *      question: string,
 *     intention: string,
 *     answer: string 
* }]
   
  - skill gaps : [{
     skill : ""
     severity : {
      type:string
      enum : ["low", "medium", "high"]
     }
  }]
 * 
 * -prepration plan : [{
 *     day:Number,
 *     focus : string,
 *     tasks : [string]
 * }]
 */
const technicalQuestionSchema = new moongoose.Schema({
    question: { type: String, required: [true, "Question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] }
},{_id:false})

const behavioralQuestionSchema = new moongoose.Schema({
    question: { type: String, required: [true, "Question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] }
},{_id:false})

const skillGapSchema = new moongoose.Schema({
    skill: { type: String, required: [true, "Skill is required"] },
    severity: { 
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
     }
},{_id:false})

const preparationPlanSchema = new moongoose.Schema({
    day: { type: Number, required: [true, "Day is required"] },
    focus: { type: String, required: [true, "Focus is required"] },
    tasks: [{ type: String, required: [true, "Tasks are required"] }]
},{_id:false})

const interviewReportSchema = new moongoose.Schema({
    jobDescription: { type: String, required: [true, "Job description is required"] },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min:0,
      max:100
    },
   
    technicalQuestions: [technicalQuestionSchema],

    behavioralQuestions: [behavioralQuestionSchema],

    skillGaps: [skillGapSchema],

    preparationPlan: [preparationPlanSchema]

}, { timestamps: true })

const InterviewReport = moongoose.model('InterviewReport', interviewReportSchema);

export default InterviewReport;

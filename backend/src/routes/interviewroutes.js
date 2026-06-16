import express from "express"
import authuser from "../middlewares/auth.js"
import {generateinterviewreportcontroller} from "../controllers/interviewcontroller.js"
import {getInterviewReportByIdController} from "../controllers/interviewcontroller.js"
import {getAllInterviewReportsController} from "../controllers/interviewcontroller.js"
import upload from "../middlewares/filemiddleware.js"
const interviewRouter = express.Router()


/**
 * @oute POST /api/interview
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access.private
 * 
 */
interviewRouter.post("/",authuser,upload.single("resume"),generateinterviewreportcontroller)

/**
 * @route GET/api/interview/report/:interviewId
 * @description get interview report by interviewId,
 * @access private
 */

interviewRouter.get("/report/:interviewId",authuser,getInterviewReportByIdController)

/**
 * @route GET/api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */

interviewRouter.get("/",authuser,getAllInterviewReportsController)

export default interviewRouter; 
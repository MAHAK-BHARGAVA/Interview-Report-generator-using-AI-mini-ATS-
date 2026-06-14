import express from "express"
import authuser from "../middlewares/auth.js"
import generateinterviewreportcontroller from "../controllers/interviewcontroller.js"
import upload from "../middlewares/filemiddleware.js"
const interviewRouter = express.Router()


/**
 * @oute POST /api/interview
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access.private
 * 
 */
interviewRouter.post("/",authuser,upload.single("resume"),generateinterviewreportcontroller)
export default interviewRouter; 
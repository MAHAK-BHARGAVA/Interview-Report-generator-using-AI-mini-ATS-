import express from "express"
import authMiddleware from "../middlewares/auth.js"
import interviewcontroller from "../controllers/interviewcontroller.js"
import upload from "../middlewares/filemiddleware.js"
const interviewRouter = express.Router()


/**
 * @oute POST /api/interview
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access.private
 * 
 */
interviewRouter.post("/",authMiddleware.authuser,upload.single("resume"),interviewcontroller.generateinterviewreportcontroller)
export default interviewRouter; 
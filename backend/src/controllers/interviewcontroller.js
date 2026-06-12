import pdfParse from "pdf-parse";
import generateInterviewReport from "../services/ai.service";
async function generateinterviewreportcontroller(req,res){
   const resumeFile = req.file

   const resumeContent = pdfParse(req.file.buffer)
   const {selfDescription,jobDescription} = req.body

   const interviewreportbyai = await generateInterviewReport({
       resume: resumeContext,
       selfDescription,
       jobDescription
   })
    
}

export default generateinterviewreportcontroller;
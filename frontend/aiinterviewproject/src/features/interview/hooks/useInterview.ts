import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

type GenerateReportParams = {
     jobDescription: string,
     selfDescription: string,
     resumeFile: File,
}

type GetReportParams = {
     interviewId: string
}

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }: GenerateReportParams) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response
        } catch (error) {
             throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async ({interviewId}:GetReportParams) => {
         setLoading(true)
         try{
            const response = await getInterviewReportById({interviewId})
            setReport(response.interviewReport)
            return response
         } catch (error) {
            throw error
         } finally {
            setLoading(false)
         }
    }

    const getReports = async () => {
         setLoading(true)
         try{
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response
         } catch (error) {
            throw error
         } finally {
            setLoading(false)
         }
    }

    return {loading,report,reports,generateReport,getReportById,getReports}
  
}
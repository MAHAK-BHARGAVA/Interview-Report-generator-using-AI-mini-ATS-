import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useInterview } from "../hooks/useInterview"
import InterviewReportUI from "./interviewpage"

export default function ReportPage() {
  const { interviewId } = useParams()
  const { report, getReportById, loading } = useInterview()

  useEffect(() => {
    if (interviewId) getReportById({ interviewId })
  }, [interviewId])

  if (loading) return <div>Loading...</div>
  if (!report) return <div>Report not found.</div>

  return <InterviewReportUI report={report} />
}
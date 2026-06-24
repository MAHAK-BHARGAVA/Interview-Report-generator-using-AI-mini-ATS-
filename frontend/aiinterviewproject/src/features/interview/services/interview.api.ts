import axios from "axios";

const api = axios.create({
     baseURL: "http://localhost:3000",
     withCredentials: true,
})

type GenerateReportParams = {
     jobDescription: string,
     selfDescription: string,
     resumeFile: File,
}

type GetReportParams = {
     interviewId: string
}

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }: GenerateReportParams) => {
     const formData = new FormData()
     formData.append("jobDescription", jobDescription)
     formData.append("selfDescription", selfDescription)
     formData.append("resume", resumeFile)

     const response = await api.post("/api/interview/", formData, {
          headers: {
               "Content-Type": "multipart/form-data"
          }
     })

     return response.data
}

export const getInterviewReportById = async ({ interviewId }: GetReportParams) => {
     const response = await api.get(`/api/interview/report/${interviewId}`)

     return response.data
}

export const getAllInterviewReports = async () => {
     const response = await api.get("/api/interview/")

     return response.data
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewId }: GetReportParams) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewId}`,
    {}, // no body
    {
      responseType: "blob", // ✅ correct place
    }
  );

  return response.data;
};
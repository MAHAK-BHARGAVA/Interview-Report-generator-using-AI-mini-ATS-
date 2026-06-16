import { createContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from 'react';

// ✅ define your actual data shapes
interface QuestionItem {
  question: string;
  intention: string;
  answer: string;
}

interface SkillGap {
  skill: string;
  severity: "Low" | "Medium" | "High";
}

interface RoadmapItem {
  day: number;
  focus: string;
  tasks: string[];
}

export interface InterviewReport {
  _id: string;
  matchScore: number;
  title: string;
  technicalQuestions: QuestionItem[];
  behavioralQuestions: QuestionItem[];
  skillGaps: SkillGap[];
  preparationPlan: RoadmapItem[];
}

export interface InterviewReportSummary {
  _id: string;
  title: string;
  matchScore: number;
  createdAt: string;
}

interface InterviewContextType {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  report: InterviewReport | null;                           // ✅ was: boolean | null
  setReport: Dispatch<SetStateAction<InterviewReport | null>>;
  reports: InterviewReportSummary[] | null;                 // ✅ was: boolean | null
  setReports: Dispatch<SetStateAction<InterviewReportSummary[] | null>>;
}

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewContext = createContext<InterviewContextType | null>(null);

export const InterviewProvider = ({ children }: InterviewProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [reports, setReports] = useState<InterviewReportSummary[] | null>(null);

  return (
    <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
      {children}
    </InterviewContext.Provider>
  );
};
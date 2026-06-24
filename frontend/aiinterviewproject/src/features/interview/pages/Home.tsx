import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type {
  CSSProperties,
  DragEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useInterview } from "../hooks/useInterview";

// ─── Design Tokens ───────────────────────────────────────────
const tokens = {
  primary: "#3730A3",
  primaryLight: "#EEF2FF",
  bg: "#F0F2FA",
  cardBg: "#FFFFFF",
  inputBg: "#F8F9FE",
  inputBorder: "#CBD5E1",
  inputFocusBorder: "#3730A3",
  errorBorder: "#EF4444",
  errorText: "#DC2626",
  text: "#0F172A",
  textMuted: "#64748B",
  footerBg: "#F1F3F9",
  borderRadius: "8px",
  cardRadius: "14px",
} as const;

// ─── Props Interfaces ─────────────────────────────────────────
interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

interface SelfDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

interface ResumeUploaderProps {
  file: File | null;
  isDragOver: boolean;
  onFileSelect: (file: File) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  error?: string;
}

interface GenerateReportButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

interface FormErrors {
  jobDescription?: string;
  selfDescription?: string;
  resume?: string;
}

interface ReportFormProps {
  jobDescription: string;
  selfDescription: string;
  resumeFile: File | null;
  isLoading: boolean;
  errors: FormErrors;
  isDragOver: boolean;
  onJobDescriptionChange: (value: string) => void;
  onSelfDescriptionChange: (value: string) => void;
  onResumeUpload: (file: File) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onSubmit: () => void;
  apiError?: string | null;
}

// ─── Style Helpers ────────────────────────────────────────────
const fieldWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: tokens.text,
};

const errorMsgStyle: CSSProperties = {
  margin: "2px 0 0",
  fontSize: 12,
  color: tokens.errorText,
};

const formCardStyle: CSSProperties = {
  background: tokens.cardBg,
  borderRadius: tokens.cardRadius,
  border: "1px solid #E2E8F0",
  padding: "28px 28px 32px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  boxShadow: "0 2px 12px rgba(55,48,163,0.06)",
};

const footerStyle: CSSProperties = {
  background: tokens.footerBg,
  borderTop: "1px solid #E2E8F0",
  padding: "20px 40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
};

function getTextareaStyle(focused: boolean, error?: string): CSSProperties {
  return {
    resize: "vertical",
    minHeight: 120,
    padding: "12px 14px",
    fontSize: 13,
    color: tokens.text,
    background: tokens.inputBg,
    border: `1.5px solid ${error ? tokens.errorBorder : focused ? tokens.inputFocusBorder : tokens.inputBorder}`,
    borderRadius: tokens.borderRadius,
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.6,
    width: "100%",
    boxSizing: "border-box",
  };
}

function getDropzoneStyle(
  isDragOver: boolean,
  error?: string,
  hasFile?: boolean,
): CSSProperties {
  return {
    border: `1.5px dashed ${error ? tokens.errorBorder : isDragOver ? tokens.primary : hasFile ? tokens.primary : tokens.inputBorder}`,
    borderRadius: tokens.borderRadius,
    background: isDragOver
      ? tokens.primaryLight
      : hasFile
        ? "#F5F7FF"
        : tokens.inputBg,
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    gap: 4,
  };
}

function getButtonStyle(disabled: boolean): CSSProperties {
  return {
    width: "100%",
    padding: "14px 20px",
    background: disabled ? "#A5B4FC" : tokens.primary,
    color: "#fff",
    border: "none",
    borderRadius: tokens.borderRadius,
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    letterSpacing: "0.01em",
    fontFamily: "inherit",
  };
}

// ─── Icons ────────────────────────────────────────────────────
function UploadCloudIcon({ isDragOver }: { isDragOver: boolean }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isDragOver ? tokens.primary : "#6366F1"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s-1-1-1-3a6 6 0 0 1 6-6 5 5 0 0 1 9 2h1a4 4 0 0 1 0 8H5" />
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={tokens.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <polyline points="9 17 9 10" />
      <polyline points="12 17 12 13" />
      <polyline points="15 17 15 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <>
      <style>{`@keyframes recruitai-spin { to { transform: rotate(360deg); } }`}</style>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ animation: "recruitai-spin 0.8s linear infinite" }}
      >
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    </>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={tokens.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────
export function Navbar() {
  const navigate = useNavigate()
  const navStyle: CSSProperties = {
    background: "#fff",
    borderBottom: "1px solid #E2E8F0",
    padding: "0 40px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const navLinkStyle: CSSProperties = {
    color: "#334155",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  };

  const avatarBtnStyle: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: `1.5px solid ${tokens.inputBorder}`,
    background: tokens.primaryLight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

    return (
  <>
    <style>{`
      @media (max-width: 768px) {
        .rai-navbar { padding: 0 16px !important; gap: 8px !important; }
        .rai-navbar span { font-size: 16px !important; }
        .rai-nav-links { gap: 14px !important; }
        .rai-nav-links a, .rai-nav-links button { font-size: 12px !important; white-space: nowrap; }
        .rai-main-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
    <nav style={navStyle} className="rai-navbar">
      <span style={{ fontWeight: 800, fontSize: 18, color: tokens.primary, letterSpacing: "-0.3px" }}>
        RecruitAI
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="rai-nav-links">
        <button onClick={() => navigate("/reports")} style={navLinkStyle}>My Reports</button>
        <a href="#" style={navLinkStyle}>How it Works</a>
        <button style={avatarBtnStyle} aria-label="User profile">
          <UserIcon />
        </button>
      </div>
    </nav>
  </>
);
}

// ─── HeroSection ─────────────────────────────────────────────
export function HeroSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        paddingTop: 8,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 900,
            color: tokens.text,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: 0,
          }}
        >
          Generate Your
          <br />
          Recruitment Match
          <br />
          Report
        </h1>
        <p
          style={{
            marginTop: 16,
            fontSize: 14,
            color: tokens.textMuted,
            lineHeight: 1.65,
            maxWidth: 360,
          }}
        >
          Upload your details to get an AI-powered analysis of your fit for the
          role. Our advanced algorithms analyze compatibility across skills,
          experience, and professional narrative.
        </p>
      </div>
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          width: "100%",
          maxWidth: 420,
          aspectRatio: "4/3",
        }}
      >
        <img
          src="data:image/jpeg;base64,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"
          alt="Laptop with analytics dashboard on a desk"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

// ─── JobDescriptionInput ──────────────────────────────────────
export function JobDescriptionInput({
  value,
  onChange,
  error,
}: JobDescriptionInputProps) {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div style={fieldWrapStyle}>
      <label style={labelStyle} htmlFor="job-description">
        Job Description
      </label>
      <textarea
        id="job-description"
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Paste the full job description here..."
        rows={6}
        style={getTextareaStyle(focused, error)}
        aria-describedby={error ? "job-description-error" : undefined}
      />
      {error && (
        <p id="job-description-error" style={errorMsgStyle}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SelfDescriptionInput ─────────────────────────────────────
export function SelfDescriptionInput({
  value,
  onChange,
  error,
}: SelfDescriptionInputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <div style={fieldWrapStyle}>
      <label style={labelStyle} htmlFor="self-description">
        Self Description
      </label>
      <textarea
        id="self-description"
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Describe your key achievements, skills, and why you are interested in this role..."
        rows={6}
        style={getTextareaStyle(focused, error)}
        aria-describedby={error ? "self-description-error" : undefined}
      />
      {error && (
        <p id="self-description-error" style={errorMsgStyle}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── ResumeUploader ───────────────────────────────────────────
export function ResumeUploader({
  file,
  isDragOver,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  error,
}: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
  };

  return (
    <div style={fieldWrapStyle}>
      <label style={labelStyle}>Resume Upload</label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume PDF"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={getDropzoneStyle(isDragOver, error, !!file)}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) onFileSelect(f);
          }}
          aria-hidden="true"
        />
        {file ? (
          <>
            <CheckIcon />
            <p
              style={{
                margin: "8px 0 2px",
                fontWeight: 600,
                fontSize: 14,
                color: tokens.primary,
              }}
            >
              {file.name}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: tokens.textMuted }}>
              Click to replace
            </p>
          </>
        ) : (
          <>
            <UploadCloudIcon isDragOver={isDragOver} />
            <p
              style={{
                margin: "10px 0 2px",
                fontSize: 14,
                color: tokens.text,
                fontWeight: 500,
              }}
            >
              {isDragOver
                ? "Drop your PDF here"
                : "Click to upload or drag and drop"}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: tokens.textMuted }}>
              .PDF format only
            </p>
          </>
        )}
      </div>
      {error && <p style={errorMsgStyle}>{error}</p>}
    </div>
  );
}

// ─── GenerateReportButton ─────────────────────────────────────
export function GenerateReportButton({
  isLoading,
  isDisabled,
  onClick,
}: GenerateReportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      style={getButtonStyle(isDisabled || isLoading)}
    >
      {isLoading ? (
        <>
          <SpinnerIcon />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <span>Generate Report</span>
          <ChartIcon />
        </>
      )}
    </button>
  );
}

// ─── ReportForm ───────────────────────────────────────────────
export function ReportForm({
  jobDescription,
  selfDescription,
  resumeFile,
  isLoading,
  errors,
  isDragOver,
  onJobDescriptionChange,
  onSelfDescriptionChange,
  onResumeUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onSubmit,
  apiError
}: ReportFormProps) {
  const isDisabled =
    !jobDescription.trim() || !selfDescription.trim() || !resumeFile;

  return (
    <div style={formCardStyle}>
      <JobDescriptionInput
        value={jobDescription}
        onChange={onJobDescriptionChange}
        error={errors.jobDescription}
      />
      <SelfDescriptionInput
        value={selfDescription}
        onChange={onSelfDescriptionChange}
        error={errors.selfDescription}
      />
      <ResumeUploader
        file={resumeFile}
        isDragOver={isDragOver}
        onFileSelect={onResumeUpload}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        error={errors.resume}
      />
      <GenerateReportButton
        isLoading={isLoading}
        isDisabled={isDisabled}
        onClick={onSubmit}
      />

      {apiError && (
  <p style={{
    background: "#ffe6e6",
    color: "#d32f2f",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginTop: 10
  }}>
    {apiError}
  </p>
)}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────
export function Footer() {
  const links: string[] = [
    "Privacy Policy",
    "Terms of Service",
    "Contact Support",
    "API Documentation",
  ];

  return (
    <footer style={footerStyle}>
      <div>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 13,
            color: tokens.text,
          }}
        >
          RecruitAI
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: tokens.textMuted }}>
          © 2024 RecruitAI Systems. All rights reserved.
        </p>
      </div>
      <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {links.map((link) => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: 12,
              color: tokens.textMuted,
              textDecoration: "none",
            }}
          >
            {link}
          </a>
        ))}
      </nav>
    </footer>
  );
}

// ─── ReportGeneratorPage ──────────────────────────────────────
export function Home() {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [selfDescription, setSelfDescription] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const { loading, generateReport } = useInterview();
  const navigate = useNavigate();

  const handleSubmit = async (): Promise<void> => {
    if (loading) return;
    const newErrors: FormErrors = {};

    if (jobDescription.trim().length < 50)
      newErrors.jobDescription = "Minimum 50 characters required.";

    if (selfDescription.trim().length < 30)
      newErrors.selfDescription = "Minimum 30 characters required.";

    if (!resumeFile) newErrors.resume = "Please upload a PDF resume.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setApiError(null);
      const result = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: resumeFile!, // safe because we validated
      });

      console.log("Report:", result);

      navigate(`/report/${result.interviewReport._id}`);  
    } catch (err: any) {
      setApiError(err?.message || "Failed to generate report");
      console.log(err);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (): void => setIsDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") {
  setResumeFile(f);
  setErrors((prev) => ({ ...prev, resume: undefined }));
} else {
  setErrors((prev) => ({
    ...prev,
    resume: "Only PDF files are allowed",
  }));
}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: tokens.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding: "48px 24px 64px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="rai-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          <HeroSection />
          <ReportForm
            jobDescription={jobDescription}
            selfDescription={selfDescription}
            resumeFile={resumeFile}
            isLoading={loading}
            errors={errors}
            isDragOver={isDragOver}
            onJobDescriptionChange={(v) => {
              setJobDescription(v);
              setErrors((prev) => ({ ...prev, jobDescription: undefined }));
            }}
            onSelfDescriptionChange={(v) => {
              setSelfDescription(v);
              setErrors((prev) => ({ ...prev, selfDescription: undefined }));
            }}
            onResumeUpload={(f) => {
              setResumeFile(f);
              setErrors((prev) => ({ ...prev, resume: undefined }));
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onSubmit={handleSubmit}
            apiError={apiError}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;

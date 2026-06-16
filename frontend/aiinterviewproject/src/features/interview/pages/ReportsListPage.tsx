import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useInterview } from "../hooks/useInterview"

export default function ReportsListPage() {
  const { reports, getReports, loading } = useInterview()
  const navigate = useNavigate()

  useEffect(() => {
    getReports()
  }, [])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })

  const scoreColor = (score: number) => {
    if (score >= 75) return { text: "#15803d", bg: "rgba(21,128,61,0.08)", border: "rgba(21,128,61,0.2)" }
    if (score >= 50) return { text: "#b45309", bg: "rgba(180,83,9,0.08)", border: "rgba(180,83,9,0.2)" }
    return { text: "#ba1a1a", bg: "rgba(186,26,26,0.08)", border: "rgba(186,26,26,0.2)" }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-family: 'Material Symbols Outlined'; }
        * { box-sizing: border-box; }
        .report-card:hover { background: #f7f9fb !important; border-color: #0058be !important; cursor: pointer; }
        .report-card { transition: background 0.15s, border-color 0.15s; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f7f9fb", fontFamily: "Inter, sans-serif" }}>

        {/* Header */}
        <header style={{
          background: "white", borderBottom: "1px solid #e2e8f0",
          padding: "0 40px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "Inter", fontSize: 13, color: "#76777d", padding: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
              Back
            </button>
            <span style={{ color: "#e2e8f0" }}>|</span>
            <span style={{ fontFamily: "Hanken Grotesk", fontSize: 17, fontWeight: 700, color: "#191c1e" }}>
              My Reports
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#191c1e", color: "white", border: "none",
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            New Report
          </button>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          {/* Page title */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "Hanken Grotesk", fontSize: 32, fontWeight: 700, color: "#191c1e", margin: "0 0 6px" }}>
              Interview Reports
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: 15, color: "#76777d", margin: 0 }}>
              {loading ? "Loading..." : `${reports?.length ?? 0} report${reports?.length !== 1 ? "s" : ""} generated`}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  background: "white", border: "1px solid #e2e8f0", borderRadius: 12,
                  padding: 24, height: 88,
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && (!reports || reports.length === 0) && (
            <div style={{
              background: "white", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "64px 32px", textAlign: "center",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#c6c6cd", display: "block", marginBottom: 16 }}>
                description
              </span>
              <h3 style={{ fontFamily: "Hanken Grotesk", fontSize: 20, fontWeight: 600, color: "#191c1e", margin: "0 0 8px" }}>
                No reports yet
              </h3>
              <p style={{ fontFamily: "Inter", fontSize: 14, color: "#76777d", margin: "0 0 24px" }}>
                Generate your first interview report to get started.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "#191c1e", color: "white", border: "none",
                  borderRadius: 8, padding: "10px 24px", cursor: "pointer",
                  fontFamily: "Inter", fontSize: 14, fontWeight: 600,
                }}
              >
                Generate Report
              </button>
            </div>
          )}

          {/* Report list */}
          {!loading && reports && reports.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reports.map((report) => {
                const c = scoreColor(report.matchScore)
                return (
                  <div
                    key={report._id}
                    className="report-card"
                    onClick={() => navigate(`/report/${report._id}`)}
                    style={{
                      background: "white", border: "1px solid #e2e8f0",
                      borderRadius: 12, padding: "20px 24px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    }}
                  >
                    {/* Left — icon + title + date */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, background: "#f0f2fa",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#0058be" }}>description</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontFamily: "Hanken Grotesk", fontSize: 16, fontWeight: 600,
                          color: "#191c1e", margin: "0 0 4px",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {report.title}
                        </p>
                        <p style={{ fontFamily: "Inter", fontSize: 12, color: "#76777d", margin: 0 }}>
                          {formatDate(report.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Right — match score + arrow */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: c.bg, border: `1px solid ${c.border}`,
                        borderRadius: 20, padding: "4px 12px",
                      }}>
                        <span style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, color: c.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>Match</span>
                        <span style={{ fontFamily: "Hanken Grotesk", fontSize: 16, fontWeight: 700, color: c.text }}>{report.matchScore}</span>
                        <span style={{ fontFamily: "Inter", fontSize: 10, color: c.text, opacity: 0.7 }}>/100</span>
                      </div>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#c6c6cd" }}>
                        chevron_right
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
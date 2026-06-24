import { useState } from "react";
import type { InterviewReport } from "../interview.context";
import { useInterview } from "../hooks/useInterview";

type Severity = "High" | "Medium" | "Low";

type QuestionType = "technical" | "behavioral";

interface QuestionItem {
  question: string;
  intention: string;
  answer: string;
}

interface SkillGap {
  skill: string;
  severity: Severity;
}

interface RoadmapItem {
  day: number;
  focus: string;
  tasks: string[];
}

// ─── Mock Data (mirrors the interviewReportSchema) ───────────────────────────
const mockReport: InterviewReport = {
  _id: "mock-id", // ✅ add this
  title: "Software Developer",
  matchScore: 85,
  technicalQuestions: [
    {
      question:
        "Implement a consistent hashing strategy for a distributed cache.",
      intention:
        "Evaluate understanding of data distribution in distributed systems and minimising reshuffling during node failure.",
      answer:
        "Discuss the hash ring concept, virtual nodes for load balance, and how keys map to the nearest clockwise server node. Mention replication factor and failure scenarios.",
    },
    {
      question: "Design a rate-limiting system that supports 100k RPS.",
      intention:
        "Assess knowledge of sliding window counters, token buckets, and distributed coordination with Redis.",
      answer:
        "Start with a token-bucket algorithm, store counters in Redis with atomic INCR + TTL, explain trade-offs vs fixed-window, and discuss multi-region sync.",
    },
    {
      question:
        "How does the JavaScript event loop handle microtasks vs macrotasks?",
      intention:
        "Test depth of JS runtime understanding and ability to predict async execution order.",
      answer:
        "Explain call stack → microtask queue (Promises, queueMicrotask) drains completely before the next macrotask (setTimeout, setInterval). Walk through a concrete example.",
    },
    {
      question: "Walk me through how you'd implement Two Sum in O(n) time.",
      intention:
        "Assess proficiency in hash map lookup efficiency and O(n) space/time trade-offs.",
      answer:
        "Single-pass hash map: store each number's index as you iterate. For each element check if its complement exists in the map before inserting.",
    },
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a time you had a conflict with a peer.",
      intention:
        "Check for emotional intelligence, conflict resolution skills, and professional maturity.",
      answer:
        "Use STAR: focus on the professional disagreement, the proactive step taken to resolve it (1-on-1 sync, shared doc), and the collaborative outcome. Avoid blame.",
    },
    {
      question:
        "Describe a project where you had to make a decision with incomplete information.",
      intention:
        "Gauge comfort with ambiguity, decision frameworks, and risk communication.",
      answer:
        "Explain the context, the data you had vs. what was missing, the framework used (e.g. reversible vs irreversible), the stakeholders consulted, and the result.",
    },
    {
      question: "Give an example of a time you mentored someone junior.",
      intention:
        "Evaluate leadership potential, empathy, and ability to elevate team capability.",
      answer:
        "Describe pairing sessions, specific techniques (rubber duck debugging, code review rituals), how you tracked their progress, and the outcome for the team.",
    },
  ],
  skillGaps: [
    { skill: "Redis", severity: "High" },
    { skill: "Message Queues", severity: "High" },
    { skill: "System Design", severity: "Medium" },
    { skill: "Event Loop", severity: "Low" },
    { skill: "TypeScript Generics", severity: "Medium" },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "Data Structures",
      tasks: [
        "Solve 5 LeetCode medium array/hash-map problems. Read CLRS Ch.11 on hash tables.",
      ],
    },
    {
      day: 2,
      focus: "System Design",
      tasks: [
        "Read 'Designing Data-Intensive Applications' Ch.5–6. Sketch a URL shortener architecture.",
      ],
    },
    {
      day: 3,
      focus: "Redis Deep Dive",
      tasks: [
        "Complete Redis University RU101 course. Implement a rate-limiter with ioredis.",
      ],
    },
    {
      day: 4,
      focus: "Message Queues",
      tasks: [
        "Set up a local RabbitMQ instance. Build a producer-consumer demo with retry logic.",
      ],
    },
    {
      day: 5,
      focus: "Behavioural Prep",
      tasks: [
        "Write STAR answers for 6 common leadership scenarios. Record yourself and review.",
      ],
    },
    {
      day: 6,
      focus: "Mock Interview",
      tasks: [
        "Schedule a 60-min mock on Pramp. Time yourself on 2 system design prompts.",
      ],
    },
    {
      day: 7,
      focus: "Review & Rest",
      tasks: [
        "Revisit flashcards for all skill gaps. Light reading only — no new material.",
      ],
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const severityStyles = {
  High: {
    badge: "bg-red-50 text-red-700 border border-red-200",
    bar: "bg-red-500",
    width: "w-[85%]",
  },
  Medium: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    bar: "bg-amber-500",
    width: "w-[50%]",
  },
  Low: {
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    bar: "bg-blue-400",
    width: "w-[25%]",
  },
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "technical", label: "Technical Questions", icon: "code" },
  { id: "behavioral", label: "Behavioral Questions", icon: "chat" },
  { id: "gaps", label: "Skill Gaps", icon: "warning" },
  { id: "roadmap", label: "Prep Roadmap", icon: "map" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatchScoreRing({ score }: { score: number }) {
  const r = 52,
    cx = 64,
    cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <svg width={128} height={128} viewBox="0 0 128 128">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={10}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#0058be"
          strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily: "Hanken Grotesk",
            fontWeight: 700,
            fontSize: 28,
            fill: "#191c1e",
          }}
        >
          {score}
        </text>
        <text
          x="50%"
          y="68%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: 11,
            fill: "#76777d",
          }}
        >
          /100
        </text>
      </svg>
      <span style={{ fontFamily: "Inter", fontSize: 12, color: "#45464d" }}>
        Match Score
      </span>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "Inter",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#76777d",
        marginBottom: 4,
      }}
    >
      {text}
    </p>
  );
}

function QuestionCard({
  item,
  index,
  type,
}: {
  item: QuestionItem;
  index: number;
  type: QuestionType;
}) {
  const [open, setOpen] = useState(false);
  const icon = type === "technical" ? "code" : "diversity_3";
  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        borderBottom: "1px solid #e2e8f0",
        padding: "24px 32px",
        cursor: "pointer",
        transition: "background 0.15s",
        background: open ? "#f2f4f6" : "white",
      }}
      onMouseEnter={(e) => {
        if (!open) e.currentTarget.style.background = "#f7f9fb";
      }}
      onMouseLeave={(e) => {
        if (!open) e.currentTarget.style.background = "white";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
        <span
          className="material-symbols-outlined"
          style={{
            color: open ? "#0058be" : "#c6c6cd",
            marginTop: 2,
            fontSize: 20,
          }}
        >
          {icon}
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <h4
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                fontWeight: 600,
                color: open ? "#0058be" : "#191c1e",
                margin: 0,
                lineHeight: "22px",
                transition: "color 0.15s",
              }}
            >
              Q{index + 1}. {item.question}
            </h4>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18,
                color: "#c6c6cd",
                flexShrink: 0,
                marginTop: 2,
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              chevron_right
            </span>
          </div>

          {open && (
            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div
                style={{
                  background: "#f7f9fb",
                  borderRadius: 8,
                  padding: 16,
                  border: "1px solid #e2e8f0",
                }}
              >
                <SectionLabel text="Interviewer's Intention" />
                <p
                  style={{
                    fontFamily: "Inter",
                    fontSize: 13,
                    color: "#45464d",
                    lineHeight: "20px",
                    margin: 0,
                  }}
                >
                  {item.intention}
                </p>
              </div>
              <div
                style={{
                  background: "#eef3fb",
                  borderRadius: 8,
                  padding: 16,
                  border: "1px solid #d8e2ff",
                }}
              >
                <SectionLabel text="How to Answer" />
                <p
                  style={{
                    fontFamily: "Inter",
                    fontSize: 13,
                    color: "#191c1e",
                    lineHeight: "20px",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillGapCard({ item }: { item: SkillGap }) {
  const s = severityStyles[item.severity];
  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        padding: 14,
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 13,
            fontWeight: 700,
            color: "#191c1e",
          }}
        >
          {item.skill}
        </span>
        <span
          className={`${s.badge}`}
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {item.severity}
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "#e0e3e5",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          className={`${s.bar} ${s.width}`}
          style={{
            height: "100%",
            borderRadius: 99,
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        padding: "20px 0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      {/* Day badge */}
      <div
        style={{
          minWidth: 48,
          height: 48,
          borderRadius: 8,
          background: "#131b2e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          gap: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Inter",
            fontSize: 9,
            fontWeight: 600,
            color: "#7c839b",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Day
        </span>
        <span
          style={{
            fontFamily: "Hanken Grotesk",
            fontSize: 18,
            fontWeight: 700,
            color: "#bec6e0",
            lineHeight: 1,
          }}
        >
          {item.day}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Focus */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 9,
              fontWeight: 700,
              color: "#76777d",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            Focus
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 13,
              fontWeight: 600,
              color: "#0058be",
              background: "rgba(0,88,190,0.07)",
              padding: "2px 10px",
              borderRadius: 4,
            }}
          >
            {item.focus}
          </span>
        </div>
        {/* Task */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 9,
              fontWeight: 700,
              color: "#76777d",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              flexShrink: 0,
              paddingTop: 2,
            }}
          >
            Task
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {item.tasks.map((t, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  color: "#45464d",
                  lineHeight: "20px",
                  margin: 0,
                }}
              >
                • {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main views ───────────────────────────────────────────────────────────────

function OverviewView({ report }: { report: InterviewReport }) {
  const total =
    report.technicalQuestions.length + report.behavioralQuestions.length;
  const highGaps = report.skillGaps.filter(
    (g: SkillGap) => g.severity === "High",
  ).length;
  return (
    <div>
      <h1
        style={{
          fontFamily: "Hanken Grotesk",
          fontSize: 36,
          fontWeight: 700,
          color: "#191c1e",
          margin: "0 0 6px",
          letterSpacing: "-0.01em",
        }}
      >
        Interview Report
      </h1>
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 16,
          color: "#76777d",
          margin: "0 0 32px",
        }}
      >
        AI-generated prep plan based on your profile and target role.
      </p>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "Match Score",
            value: `${report.matchScore}%`,
            icon: "emoji_events",
            accent: "#0058be",
          },
          {
            label: "Questions Ready",
            value: total,
            icon: "quiz",
            accent: "#191c1e",
          },
          {
            label: "High-Priority Gaps",
            value: highGaps,
            icon: "warning",
            accent: "#ba1a1a",
          },
          {
            label: "Prep Days",
            value: report.preparationPlan.length,
            icon: "calendar_month",
            accent: "#45464d",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: s.accent,
                fontSize: 22,
                marginBottom: 8,
                display: "block",
              }}
            >
              {s.icon}
            </span>
            <div
              style={{
                fontFamily: "Hanken Grotesk",
                fontSize: 28,
                fontWeight: 700,
                color: "#191c1e",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 12,
                color: "#76777d",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Match score + top gaps */}
      <div
        style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24 }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 32,
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MatchScoreRing score={report.matchScore} />
        </div>
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 24,
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "Hanken Grotesk",
              fontSize: 18,
              fontWeight: 600,
              color: "#191c1e",
              margin: "0 0 4px",
            }}
          >
            Skill Gaps Summary
          </h3>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 13,
              color: "#76777d",
              margin: "0 0 16px",
            }}
          >
            Focus on these to improve your match score.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {report.skillGaps.map((g) => (
              <SkillGapCard key={g.skill} item={g} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionsView({
  questions,
  type,
}: {
  questions: QuestionItem[];
  type: QuestionType;
}) {
  const label = type === "technical" ? "Technical" : "Behavioral";
  const track = type === "technical" ? "Engineering Track" : "Leadership Track";
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "Hanken Grotesk",
            fontSize: 32,
            fontWeight: 700,
            color: "#191c1e",
            margin: "0 0 6px",
            letterSpacing: "-0.01em",
          }}
        >
          {label} Questions
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 15,
            color: "#76777d",
            margin: 0,
          }}
        >
          {questions.length} questions ready — click to reveal intention &
          answer approach.
        </p>
      </div>
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <div
          style={{
            padding: "18px 32px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f7f9fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Hanken Grotesk",
              fontSize: 16,
              fontWeight: 600,
              color: "#191c1e",
            }}
          >
            Question Bank
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 11,
              fontWeight: 700,
              color: "#0058be",
              background: "rgba(0,88,190,0.08)",
              padding: "3px 12px",
              borderRadius: 20,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {track}
          </span>
        </div>
        {questions.map((q, i) => (
          <QuestionCard key={i} item={q} index={i} type={type} />
        ))}
      </div>
    </div>
  );
}

function SkillGapsView({ gaps }: { gaps: SkillGap[] }) {
  const high = gaps.filter((g: SkillGap) => g.severity === "High");
  const medium = gaps.filter((g: SkillGap) => g.severity === "Medium");
  const low = gaps.filter((g: SkillGap) => g.severity === "Low");
  const groups: Array<[string, SkillGap[], string]> = [
    ["High Priority", high, "ba1a1a"],
    ["Medium Priority", medium, "b45309"],
    ["Low Priority", low, "1d4ed8"],
  ];
  return (
    <div>
      <h1
        style={{
          fontFamily: "Hanken Grotesk",
          fontSize: 32,
          fontWeight: 700,
          color: "#191c1e",
          margin: "0 0 6px",
          letterSpacing: "-0.01em",
        }}
      >
        Skill Gaps
      </h1>
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 15,
          color: "#76777d",
          margin: "0 0 28px",
        }}
      >
        Identified areas where your profile falls short of the job description.
      </p>

      {groups.map(
        ([title, items, color]) =>
          items.length > 0 && (
            <div key={title} style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <h3
                  style={{
                    fontFamily: "Hanken Grotesk",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#191c1e",
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: 11,
                    fontWeight: 700,
                    color: `#${color}`,
                    background: `rgba(${parseInt(color.slice(0, 2), 16)},${parseInt(color.slice(2, 4), 16)},${parseInt(color.slice(4, 6), 16)},0.08)`,
                    padding: "2px 10px",
                    borderRadius: 20,
                  }}
                >
                  {items.length} skill{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {items.map((g: SkillGap) => (
                  <SkillGapCard key={g.skill} item={g} />
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}

function RoadmapView({ plan }: { plan: RoadmapItem[] }) {
  return (
    <div>
      <h1
        style={{
          fontFamily: "Hanken Grotesk",
          fontSize: 32,
          fontWeight: 700,
          color: "#191c1e",
          margin: "0 0 6px",
          letterSpacing: "-0.01em",
        }}
      >
        Preparation Roadmap
      </h1>
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 15,
          color: "#76777d",
          margin: "0 0 28px",
        }}
      >
        {plan.length}-day structured plan to close your skill gaps before the
        interview.
      </p>
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "8px 32px",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        {plan.map((item) => (
          <RoadmapCard key={item.day} item={item} />
        ))}
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function InterviewReportUI({
  report = mockReport,
}: {
  report?: InterviewReport;
}) {
  const { getResumePdf, loading } = useInterview();
  const [activeNav, setActiveNav] = useState("overview");

  const renderView = () => {
    switch (activeNav) {
      case "overview":
        return <OverviewView report={report} />;
      case "technical":
        return (
          <QuestionsView
            questions={report.technicalQuestions}
            type="technical"
          />
        );
      case "behavioral":
        return (
          <QuestionsView
            questions={report.behavioralQuestions}
            type="behavioral"
          />
        );
      case "gaps":
        return <SkillGapsView gaps={report.skillGaps} />;
      case "roadmap":
        return <RoadmapView plan={report.preparationPlan} />;
      default:
        return null;
    }
  };
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-family: 'Material Symbols Outlined'; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f7f9fb",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* ── Left Sidebar ── */}
        <aside
          style={{
            width: 260,
            flexShrink: 0,
            background: "#eceef0",
            borderRight: "1px solid #c6c6cd",
            display: "flex",
            flexDirection: "column",
            padding: "24px 0",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: "0 20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #c6c6cd",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "#191c1e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "white", fontSize: 20 }}
              >
                terminal
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Hanken Grotesk",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#191c1e",
                  lineHeight: "18px",
                }}
              >
                Interview Prep
              </div>
              <div
                style={{ fontFamily: "Inter", fontSize: 11, color: "#76777d" }}
              >
                Senior Engineer Track
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav
            style={{
              flex: 1,
              padding: "0 12px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "none",
                    background: active ? "white" : "transparent",
                    borderLeft: active
                      ? "3px solid #0058be"
                      : "3px solid transparent",
                    color: active ? "#0058be" : "#45464d",
                    fontFamily: "Inter",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    textAlign: "left",
                    width: "100%",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 18,
                      color: active ? "#0058be" : "#76777d",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer widget */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e2e2e7",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={() =>
                report && getResumePdf({ interviewId: report._id })
              }
              disabled={loading || !report}
              className="resume-download-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="resume-download-btn__icon"
              >
                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
              </svg>
              <span>
                {loading ? "Downloading..." : "Download AI-generated Resume"}
              </span>
            </button>

            <style>{`
    .resume-download-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      border: 1.5px solid #d1d1d8;
      border-radius: 8px;
      background: #fff;
      color: #3d3d4d;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
    }

    .resume-download-btn:hover {
      background: #2563eb;
      border-color: #2563eb;
      color: #fff;
      box-shadow: 0 2px 10px rgba(37, 99, 235, 0.28);
    }

    .resume-download-btn__icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      transition: transform 0.22s ease;
    }

    .resume-download-btn:hover .resume-download-btn__icon {
      transform: rotate(15deg) scale(1.15);
    }
  `}</style>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {/* Top bar */}
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "rgba(247,249,251,0.9)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid #e2e8f0",
              padding: "0 40px",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "Hanken Grotesk",
                fontSize: 17,
                fontWeight: 700,
                color: "#191c1e",
              }}
            >
              InterviewPrep Pro
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                    color: "#c6c6cd",
                  }}
                >
                  search
                </span>
                <input
                  placeholder="Search questions, topics…"
                  style={{
                    paddingLeft: 32,
                    paddingRight: 14,
                    paddingTop: 6,
                    paddingBottom: 6,
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    background: "white",
                    fontFamily: "Inter",
                    fontSize: 13,
                    color: "#191c1e",
                    outline: "none",
                    width: 220,
                  }}
                />
              </div>
              {/* Match score pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "rgba(0,88,190,0.07)",
                  border: "1px solid rgba(0,88,190,0.2)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#0058be",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Match
                </span>
                <span
                  style={{
                    fontFamily: "Hanken Grotesk",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#191c1e",
                  }}
                >
                  {report.matchScore}
                </span>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: 10,
                    color: "#76777d",
                  }}
                >
                  /100
                </span>
              </div>
              {/* Avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#131b2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#bec6e0", fontSize: 18 }}
                >
                  person
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div
            style={{ padding: "36px 40px", maxWidth: 960, margin: "0 auto" }}
          >
            {renderView()}
          </div>
        </main>
      </div>
    </>
  );
}

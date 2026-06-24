// import { GoogleGenAI } from "@google/genai";
// import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema";
// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// function fixFlatArray(arr) {
//   const result = [];
//   for (let i = 0; i < arr.length; i += 6) {
//     result.push({
//       question: arr[i + 1],
//       intention: arr[i + 3],
//       answer: arr[i + 5],
//     });
//   }
//   return result;
// }

// const interviewReportschema = z.object({
//   matchscore: z
//     .number()
//     .describe(
//       "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
//     ),
//   technicalQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be asked in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question,what points to cover,what approach to answer it",
//           ),
//       }).strict(),
//     )
//     .describe(
//       "Technical questions that can be asked in the interview along with their intention",
//     ),

//   behavioralQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be asked in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question,what points to cover,what approach to answer it",
//           ),
//       }).strict(),
//     )
//     .describe(
//       "Behavioral questions that can be asked in the interview along with their intention",
//     ),
//   skillGaps: z
//     .array(
//       z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z
//           .enum(["Low", "Medium", "High"])
//           .describe("The severity of the skill gap, i.e."),
//       }).strict(),
//     )
//     .describe(
//       "List of skill gaps in the candidate's profile along with their severity",
//     ),
//   PreparationPlan: z
//     .array(
//       z.object({
//         day: z
//           .number()
//           .describe("The day number in the preparation plan,starting from 1"),
//         focus: z
//           .string()
//           .describe(
//             "The main focus of this day in the preparation plan,e.g. data structures,system design ,mock interviews etc",
//           ),
//         task: z
//           .string()
//           .describe(
//             "List of tasks to be done on this day to follow preparation plan e.g. read a specific book",
//           ),
//       }).strict(),
//     )
//     .describe(
//       "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
//     ),
//     // title: z.string().describe("The title of the job for which the interview report is generated")
// });

// async function generateInterviewReport({
//   resume,
//   jobDescription,
//   selfDescription,
// }) {
//   const prompt = `
// You are a STRICT JSON generator.

// Return a valid JSON object matching the schema below.

// IMPORTANT:
// - Each array must contain FULL objects with meaningful content
// - Do NOT return placeholder values like "question", "intention", etc.
// - Generate realistic, detailed content for each field

// CRITICAL RULE FOR ARRAYS:

// - technicalQuestions MUST be an array of OBJECTS
// - DO NOT use key-value pairs like ["question", "..."]
// - Each item MUST look like:

// {
//   "question": "...",
//   "intention": "...",
//   "answer": "..."
// }

// Same applies to behavioralQuestions.

// WRONG ❌:
// ["question", "...", "intention", "..."]

// CORRECT ✅:
// [
//   {
//     "question": "...",
//     "intention": "...",
//     "answer": "..."
//   }
// ]

// SCHEMA (MANDATORY):
// {
//   "matchscore": number,
//   "technicalQuestions": [
//     {
//       "question": string,
//       "intention": string,
//       "answer": string
//     }
//   ],
//   "behavioralQuestions": [
//     {
//       "question": string,
//       "intention": string,
//       "answer": string
//     }
//   ],
//   "skillGaps": [
//     {
//       "skill": string,
//       "severity": "Low" | "Medium" | "High"
//     }
//   ],
//   "PreparationPlan": [
//     {
//       "day": number,
//       "focus": string,
//       "task": string
//     }
//   ],

// }

// // EXAMPLE OUTPUT:

// // {
// //   "matchscore": 85,
// //   "technicalQuestions": [
// //     {
// //       "question": "Explain how you implemented semantic search in your project.",
// //       "intention": "To evaluate understanding of embeddings and retrieval.",
// //       "answer": "Start by explaining embedding generation, then vector DB usage..."
// //     }
// //   ],
// //   "behavioralQuestions": [
// //     {
// //       "question": "Tell me about a time you mentored someone.",
// //       "intention": "To assess leadership skills.",
// //       "answer": "Use STAR method..."
// //     }
// //   ],
// //   "skillGaps": [
// //     {
// //       "skill": "Microservices Architecture",
// //       "severity": "Medium"
// //     }
// //   ],
// //   "PreparationPlan": [
// //     {
// //       "day": 1,
// //       "focus": "System Design",
// //       "task": "Study HLD basics"
// //     }
// //   ],

// // }

// RULES:
// - Output ONLY valid JSON
// - No summaries
// - No explanations
// - No new keys
// - Match schema exactly

// Input:
// Resume:
// ${JSON.stringify(resume, null, 2)}

// Self Description:
// ${selfDescription}

// Job Description:
// ${JSON.stringify(jobDescription, null, 2)}
// `;
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(interviewReportschema),
//     },
//   });

// const raw = response.text;

// console.log("RAW AI:", raw);

// const cleaned = raw
//   .replace(/```json/g, "")
//   .replace(/```/g, "")
//   .trim();

// let result;

// const parsed = JSON.parse(cleaned);

// if (Array.isArray(parsed.technicalQuestions) && typeof parsed.technicalQuestions[0] === "string") {
//   parsed.technicalQuestions = fixFlatArray(parsed.technicalQuestions);
// }

// if (Array.isArray(parsed.behavioralQuestions) && typeof parsed.behavioralQuestions[0] === "string") {
//   parsed.behavioralQuestions = fixFlatArray(parsed.behavioralQuestions);
// }

// try {
//   result = interviewReportschema.parse(parsed);
// } catch (err) {
//   console.error( "Schema mismatch:", cleaned);
//   return { error: "Invalid AI response", raw: cleaned };
// }

// return result;
// }

// export default generateInterviewReport;
import Groq from "groq-sdk";
import { z } from "zod";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100), // ✅ camelCase — matches Mongoose model
  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(3),
  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(2),
  skillGaps: z
    .array(
      z.object({
        skill: z.string(),
        severity: z.enum(["Low", "Medium", "High"]),
      }),
    )
    .min(1),
  preparationPlan: z
    .array(
      z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string()), // ✅ array of strings — matches Mongoose model
      }),
    )
    .min(3),
  title: z.string(), // ✅ kept, prompt now asks for it
});

async function generateInterviewReport({
  resumeText,
  jobDescription,
  selfDescription,
}) {
  //                                      ^^^^^^^^^^ ✅ matches what controller sends

  const prompt = `You are an expert technical interviewer and career coach.

Analyze the candidate's resume, self-description, and job description.
Return ONLY a valid JSON object. No markdown, no explanation, no extra text.

Resume:
${resumeText}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return this exact JSON structure:
{
  "title": "<job title from the job description>",
  "matchScore": <number 0-100>,
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "Low|Medium|High" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "...", "tasks": ["task 1", "task 2"] }
  ]
}

Generate:
- The job title from the job description as "title"
- A match score 0-100 as "matchScore"
- 3 to 5 technical questions specific to their projects and the JD
- 2 to 3 behavioral questions based on company values
- 3 to 5 skill gaps compared to the JD
- A 5-day preparation plan where each day has a "tasks" array of 2-3 strings`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content;
    console.log("RAW AI:", raw);

    const parsed = JSON.parse(raw);
    const result = interviewReportSchema.parse(parsed); // throws if shape is wrong
    return result;
  } catch (err) {
    console.error("generateInterviewReport failed:", err.message);
    throw new Error("Failed to generate interview report: " + err.message);
  }
}

// using ai to generate html for pdf generation
async function generateResumeHTML({ resume, selfDescription, jobDescription }) {
  const resumeHtmlSchema = z.object({
    html: z.string().min(100).describe("Complete single-file HTML resume"),
  });

  const prompt = `You are a senior resume writer and ATS-optimization specialist with 15 years
of experience writing resumes that get candidates interviews at top tech companies.

You will be given three inputs: a candidate's existing RESUME content, a target
JOB DESCRIPTION, and a short SELF DESCRIPTION written by the candidate. Your job is
to produce ONE tailored resume as a complete HTML document, returned inside a JSON
object, ready to be converted to a PDF with Puppeteer.

=====================
INPUTS
=====================
RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

SELF DESCRIPTION:
${selfDescription}

=====================
CONTENT RULES (apply these before you touch the HTML)
=====================
1. TRUTHFULNESS — Use only experience, projects, skills, and education that actually
   appear in RESUME or SELF DESCRIPTION. Never invent employers, titles, dates,
   numbers, metrics, or skills the candidate did not mention. If you cannot find a
   real metric, describe the impact qualitatively instead of fabricating a number.

2. TAILORING — Read the JOB DESCRIPTION and identify its core requirements: hard
   skills, tools, technologies, and responsibilities. Reuse that exact terminology
   (not synonyms) inside the candidate's bullets and skills section wherever it is
   honestly supported by their background. Reorder bullets within each entry so the
   most job-relevant ones come first.

3. WRITE LIKE A HUMAN, NOT AN AI. This is the most common way these resumes fail —
   fix it explicitly:
   - Do NOT use: "spearheaded," "leveraged," "utilized," "synergy," "passionate,"
     "results-driven," "dynamic," "proven track record," "responsible for,"
     "team player," "go-getter," "detail-oriented professional."
   - Do NOT start every bullet with the same verb. Vary verbs naturally
     (built, designed, fixed, reduced, automated, migrated, debugged, shipped...).
   - Do NOT write generic filler ("worked on various tasks related to..."). Be
     specific about WHAT was built/fixed and, where true, WHAT changed as a result.
   - BAD:  "Leveraged React to develop dynamic, scalable web applications."
   - GOOD: "Built a React dashboard that cut manual reporting time from 3 hours to 20 minutes."
   - BAD:  "Responsible for managing the company's social media presence."
   - GOOD: "Ran the Instagram account, growing followers from 2k to 11k in 6 months."
   - Keep sentences plain and concrete. A few short, slightly imperfect, very human
     sentences read better than five polished, generic ones.

4. BULLET FORMAT — Each bullet starts with a past/present action verb (no "I"),
   stays under ~20 words, and leads with what was done before how it was done.
   Most relevant entry gets 3–4 bullets; older/less relevant entries get 1–2.

5. SECTION INCLUSION — Only output a section if RESUME/SELF DESCRIPTION actually has
   content for it. If there are no achievements, DELETE the entire achievements
   <div class="section">...</div> block — do not leave it with placeholder text.
   Same rule for Projects, Extra Curricular, etc. Never output a section with no
   real content "just to fill the template."

6. SECTION ORDER — Keep Education and Skills in place, but if the candidate has
   strong, relevant projects and thin/no work experience (e.g. a student/fresher),
   put Projects before Work Experience. Otherwise keep Work Experience first.

7. LENGTH BUDGET — Target 1 page, 2 pages max, at the font sizes already defined in
   the CSS (do not change the CSS). To stay in budget: include at most 3 work
   experiences and 3 projects — pick the ones most relevant to the JOB DESCRIPTION
   and drop the rest rather than shrinking everyone's content. Cut any bullet that
   doesn't support the target role.

8. SUMMARY — Use SELF DESCRIPTION to write a 2–3 line professional summary in the
   candidate's own voice (no generic "Highly motivated professional..." openers).
   Mention the role/domain from the JOB DESCRIPTION naturally if it fits.

=====================
ATS-FRIENDLINESS RULES
=====================
- Plain, linear, single-column reading order — exactly what the template below
  already provides. Do not introduce tables, multi-column layouts, or text boxes.
- No icons, emojis, or images standing in for text (e.g. no phone/email icons).
- Use the exact section headings already in the template (Education, Work
  Experience, Projects, Technical Skills, Achievement, Extra Curricular Activities)
  — these are standard ATS-recognized headers; do not rename them.
- Dates in a consistent "MMM YYYY – MMM YYYY" or "YYYY – YYYY" format throughout.
- Contact info as real plain text (real phone/email/links from RESUME, not the
  placeholder text) — never as an image.
- Spell out the first occurrence of an acronym from the job description if the
  candidate's resume also uses the long form (helps keyword matching both ways).

=====================
VISUAL STYLE
=====================
- Do not change the CSS rules or HTML structure/classes in the template.
- You may add ONE subtle accent color (e.g. for the name or section-title borders)
  by adding inline style where the template already allows it, but keep it minimal
  and print-friendly (no bright/neon colors, no background fills behind text blocks).
- Keep it clean and professional — this is a resume, not a flyer.

=====================
HTML TEMPLATE — fill it in, following all rules above
=====================
Use this exact structure (you may delete whole .entry blocks for items that don't
exist, repeat .entry blocks for multiple items, and delete whole .section blocks
for sections with no content):

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @page { size: A4; margin: 12mm 15mm 12mm 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    color: #000;
    line-height: 1.65;
    max-width: 794px;
  }
  .header { text-align: center; margin-bottom: 6px; }
  .header h1 { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
  .header .contact { font-size: 9.5px; margin-top: 3px; }
  .header .contact a { color: #000; text-decoration: none; }
  .section { margin-bottom: 14px; page-break-inside: avoid; }
  .section-title {
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid #000;
    padding-bottom: 1px;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }
  .entry { margin-bottom: 8px; }
  .entry-row { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-row .title { font-weight: bold; font-size: 10px; }
  .entry-row .date { font-size: 9.5px; white-space: nowrap; }
  .entry-sub {
    display: flex;
    justify-content: space-between;
    font-style: italic;
    font-size: 9.5px;
    margin-bottom: 2px;
  }
  ul { padding-left: 15px; margin-top: 2px; }
  ul li { font-size: 9.5px; margin-bottom: 3px; }
  .skills-row { font-size: 9.5px; margin-bottom: 2px; }
  .skills-row b { font-weight: bold; }
</style>
</head>
<body>

<div class="header">
  <h1>CANDIDATE FULL NAME</h1>
  <div class="contact">
    PHONE | <a href="mailto:EMAIL">EMAIL</a> | <a href="LINKEDIN_URL">linkedin</a> | <a href="GITHUB_URL">github</a>
  </div>
</div>

<div class="section">
  <div class="section-title">Education</div>
  <div class="entry">
    <div class="entry-row"><span class="title">UNIVERSITY/SCHOOL NAME</span></div>
    <div class="entry-sub">
      <span>DEGREE, CGPA/grade if present</span>
      <span>START – END</span>
    </div>
  </div>
  <!-- repeat .entry per education item -->
</div>

<div class="section">
  <div class="section-title">Work Experience</div>
  <div class="entry">
    <div class="entry-row">
      <span class="title">COMPANY NAME — Role</span>
      <span class="date">START – END</span>
    </div>
    <ul>
      <li>Bullet tailored to job description, real and specific</li>
    </ul>
  </div>
  <!-- repeat .entry per role; omit section entirely if no experience -->
</div>

<div class="section">
  <div class="section-title">Projects</div>
  <div class="entry">
    <div class="entry-row">
      <span class="title">PROJECT NAME</span>
      <span class="date">START – END (if known)</span>
    </div>
    <ul>
      <li>Bullet tailored to job description, real and specific</li>
    </ul>
  </div>
  <!-- repeat .entry per project; omit section entirely if none -->
</div>

<div class="section">
  <div class="section-title">Technical Skills</div>
  <div class="skills-row"><b>Languages:</b> only real items from resume</div>
  <div class="skills-row"><b>Frameworks:</b> only real items from resume</div>
  <div class="skills-row"><b>Libraries:</b> only real items from resume</div>
  <div class="skills-row"><b>Tools &amp; Technologies:</b> only real items from resume</div>
  <!-- omit any skills-row category that has no real items -->
</div>

<div class="section">
  <div class="section-title">Achievement</div>
  <div class="entry">
    <div class="entry-row">
      <span class="title">ACHIEVEMENT TITLE</span>
      <span class="date">DATE</span>
    </div>
    <ul><li>Real, specific bullet</li></ul>
  </div>
  <!-- omit section entirely if no real achievements -->
</div>

<div class="section">
  <div class="section-title">Extra Curricular Activities</div>
  <ul><li>Real activity from resume</li></ul>
  <!-- omit section entirely if none -->
</div>

</body>
</html>

=====================
OUTPUT FORMAT — read this carefully
=====================
Return ONLY a single valid JSON object, nothing else: no markdown fences, no
preamble, no trailing commentary, no comments inside the JSON.

{
  "html": "<the fully filled HTML as one valid JSON string>"
}

Hard requirements for that string:
- Escape every double quote inside the HTML as \\" and every newline as \\n so the
  JSON parses with a plain JSON.parse call.
- The HTML must be complete and self-contained (starts with <!DOCTYPE html>, ends
  with </html>) with no unfilled placeholders like "CANDIDATE FULL NAME" left in it.
- Do not include any text, key, or field besides "html" in the JSON object.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content;
    const parsed = JSON.parse(raw);
    const { html } = resumeHtmlSchema.parse(parsed);

    const cleanHtml = html.replace(/^```html|^```|```$/gm, "").trim();
    return cleanHtml;
  } catch (err) {
    console.error("generateResumeHTML failed:", err.message);
    throw new Error("Failed to generate resume HTML: " + err.message);
  }
}
async function generatePdfFromHTML(htmlContent) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}

export { generateInterviewReport, generatePdfFromHTML, generateResumeHTML };

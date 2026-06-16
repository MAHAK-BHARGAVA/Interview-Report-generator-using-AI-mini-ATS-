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

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),        // ✅ camelCase — matches Mongoose model
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ).min(3),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ).min(2),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["Low", "Medium", "High"]),
    })
  ).min(1),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),               // ✅ array of strings — matches Mongoose model
    })
  ).min(3),
  title: z.string(),                            // ✅ kept, prompt now asks for it
});

async function generateInterviewReport({ resumeText, jobDescription, selfDescription }) {
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
    const result = interviewReportSchema.parse(parsed);  // throws if shape is wrong
    return result;

  } catch (err) {
    console.error("generateInterviewReport failed:", err.message);
    throw new Error("Failed to generate interview report: " + err.message);
  }
}

export default generateInterviewReport;
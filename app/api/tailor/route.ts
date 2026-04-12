import { NextRequest, NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function buildPrompt(cvText: string, jobDescription: string): string {
  return `You are an elite CV writer and ATS optimization specialist with 15+ years of experience helping candidates land roles at top companies.

Your task: rewrite and perfectly tailor the provided CV for the specific job description below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORIGINAL CV:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cvText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET JOB DESCRIPTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${jobDescription}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES (follow strictly):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NEVER fabricate experience, employers, dates, qualifications, or skills not present in the original CV
2. ONLY use information already present — you may rephrase, reorder, emphasize, and enhance, but never invent
3. Incorporate relevant keywords from the job description naturally and contextually
4. Use strong, varied action verbs: Led, Engineered, Architected, Delivered, Spearheaded, Orchestrated, Optimized, Drove, Scaled
5. Quantify every achievement where numbers are present or can be inferred from context
6. Write a punchy, targeted Professional Summary (3–4 sentences) that speaks directly to this role
7. Reorder experience bullets to surface the most role-relevant achievements first
8. Use exact terminology from the job description where appropriate (ATS keyword matching)
9. Remove or condense experience not relevant to this specific role
10. Keep the tone professional, confident, and specific — no clichés like "results-driven" or "passionate about"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT (use exactly):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# [Full Name]
[Email] | [Phone if present] | [LinkedIn if present] | [GitHub/Portfolio if present]

## Professional Summary
[3–4 sharp sentences tailored to this specific role and company type]

## Work Experience

### [Job Title] — [Company Name] · [Start Date – End Date]
- [Achievement with strong verb + quantified impact]
- [Achievement with strong verb + quantified impact]
- [Achievement with strong verb + quantified impact]
(3–5 bullets per role, most relevant first)

## Technical Skills
**[Category]:** [comma-separated list]
**[Category]:** [comma-separated list]
(Only include categories with at least 3 items)

## Education
**[Degree]** · [Institution] · [Year]

## Certifications (only if present in original CV)
- [Certification name] · [Issuer] · [Year]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: Return ONLY the formatted CV in the exact markdown structure above.
No preamble, no commentary, no "Here is your tailored CV:" — just the CV itself starting with # [Full Name].
`;
}

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobDescription } = await req.json();

    if (!cvText?.trim() || !jobDescription?.trim()) {
      return NextResponse.json(
        { error: "CV text and job description are required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_free_gemini_api_key_here") {
      return NextResponse.json(
        {
          error:
            "Gemini API key not configured. Copy .env.example to .env.local and add your free key from https://aistudio.google.com/app/apikey",
        },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(cvText, jobDescription);

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.65,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 3072,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      const msg =
        (errBody as { error?: { message?: string } })?.error?.message ||
        `Gemini API error (${geminiRes.status})`;
      return NextResponse.json({ error: msg }, { status: geminiRes.status });
    }

    const data = await geminiRes.json();
    const tailoredCV: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!tailoredCV) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ tailoredCV });
  } catch (err) {
    console.error("[/api/tailor]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}

// lib/ats-analyzer.ts
import { ATSAnalysisResult, KeywordMatch, KeywordImportance, Suggestion } from './types';

// ---------- Stop words ----------
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'from','up','about','into','through','during','is','are','was','were','be',
  'been','being','have','has','had','do','does','did','will','would','could',
  'should','may','might','can','this','that','these','those','i','you','he',
  'she','it','we','they','what','which','who','when','where','why','how','all',
  'both','each','few','more','most','other','some','such','than','too','very',
  's','t','just','because','as','until','while','not','no','nor','also','its',
  'their','our','your','his','her','my','any','every','own','same','only',
  'well','then','so','yet','even','though','although','if','either','neither',
  'between','among','during','before','after','above','below','within','without',
]);

// ---------- Keyword extraction ----------
function extractKeywords(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  const clean = text.toLowerCase().replace(/[^\w\s.+#-]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = clean.split(' ');

  // Single tokens
  tokens.forEach(token => {
    const word = token.replace(/^[-.]|[-.]$/g, '');
    if (word.length >= 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  });

  // Bigrams (two-word phrases)
  for (let i = 0; i < tokens.length - 1; i++) {
    const w1 = tokens[i].replace(/^[-.]|[-.]$/g, '');
    const w2 = tokens[i + 1].replace(/^[-.]|[-.]$/g, '');
    if (w1.length >= 2 && w2.length >= 2 && !STOP_WORDS.has(w1) && !STOP_WORDS.has(w2)) {
      const bigram = `${w1} ${w2}`;
      freq.set(bigram, (freq.get(bigram) || 0) + 1);
    }
  }

  return freq;
}

function getImportance(keyword: string, freq: number): KeywordImportance {
  const isAcronym = /^[a-z0-9.+#-]{2,8}$/.test(keyword) && keyword.length <= 6;
  const isPhrase = keyword.includes(' ');
  if (freq >= 3 || (isAcronym && freq >= 2)) return 'critical';
  if (freq >= 2 || isPhrase) return 'high';
  if (isAcronym) return 'high';
  return 'medium';
}

// ---------- Suggestion generation ----------
function generateSuggestions(
  cvText: string,
  missingKeywords: string[],
  score: number
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const cv = cvText.toLowerCase();

  // Missing keywords
  if (missingKeywords.length > 0) {
    const sample = missingKeywords.slice(0, 5).map(k => `"${k}"`).join(', ');
    suggestions.push({
      id: 'missing-kw',
      category: 'keywords',
      priority: missingKeywords.length > 8 ? 'critical' : 'high',
      title: 'Add Missing Keywords',
      description: `Your CV is missing ${missingKeywords.length} keywords found in the job description. Incorporating these terms will significantly improve your ATS match score.`,
      impact: 9,
      actionItems: [
        `Weave these keywords naturally into your experience: ${sample}`,
        'Mirror exact terminology from the job posting — ATS is case-insensitive but spelling matters',
        'Add missing technical skills to a dedicated Skills section',
        'Include acronyms and their full forms (e.g., "Machine Learning (ML)")',
      ],
    });
  }

  // CV is too short
  const wordCount = cv.trim().split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push({
      id: 'length',
      category: 'content',
      priority: 'high',
      title: 'Expand Your CV Content',
      description: `Your CV is only ${wordCount} words. ATS systems reward detailed CVs — aim for 450–800 words to provide enough context for keyword matching.`,
      impact: 7,
      actionItems: [
        'Add 3–5 bullet points per role describing responsibilities and achievements',
        'Include a 3–4 sentence professional summary at the top',
        'Describe projects with outcomes: tools used, scale, and measurable results',
        'Add relevant certifications, courses, or awards',
      ],
    });
  }

  // Missing action verbs
  const actionVerbs = ['led','managed','developed','created','implemented','achieved',
    'improved','built','designed','launched','delivered','drove','spearheaded',
    'engineered','optimized','coordinated','established'];
  const hasActionVerbs = actionVerbs.some(v => cv.includes(v));
  if (!hasActionVerbs) {
    suggestions.push({
      id: 'action-verbs',
      category: 'content',
      priority: 'high',
      title: 'Use Strong Action Verbs',
      description: 'Your CV lacks impactful action verbs. Starting bullet points with strong verbs signals ownership and leadership to both ATS and human reviewers.',
      impact: 6,
      actionItems: [
        'Begin each bullet with: Led, Developed, Engineered, Delivered, Optimized',
        'Replace passive constructs ("was responsible for") with active ones ("owned")',
        'Use past tense for previous roles, present tense for current role',
        'Vary your verbs — avoid repeating the same one in a single section',
      ],
    });
  }

  // Missing quantified achievements
  const hasMetrics = /\d+\s*%|[$£€]\s*\d+|\d+[kmb]?\s+(users|clients|team|people|projects|million|billion|thousand)/i.test(cvText);
  if (!hasMetrics) {
    suggestions.push({
      id: 'quantify',
      category: 'content',
      priority: 'high',
      title: 'Quantify Your Achievements',
      description: 'Numbers make achievements concrete and credible. CVs with metrics consistently score higher in both ATS and human review stages.',
      impact: 8,
      actionItems: [
        'Add percentages: "Reduced build time by 40%"',
        'Include scale: "Managed a team of 12 engineers across 3 time zones"',
        'Mention revenue or savings: "Saved $120k annually through process automation"',
        'Track engagement: "Grew user base from 5k to 50k in 18 months"',
      ],
    });
  }

  // Missing skills section
  const hasSkills = /\b(skills|technologies|tech stack|tools|competencies|expertise)\b/i.test(cvText);
  if (!hasSkills) {
    suggestions.push({
      id: 'skills-section',
      category: 'format',
      priority: 'critical',
      title: 'Add a Dedicated Skills Section',
      description: 'ATS parsers specifically scan for skills sections. Without one, relevant skills buried in job descriptions may not be detected.',
      impact: 9,
      actionItems: [
        'Create a "Technical Skills" or "Core Competencies" section near the top',
        'Use a simple format: "Languages: Python, TypeScript | Frameworks: React, Django"',
        'Include all tools, frameworks, and methodologies mentioned in the job posting',
        'List both hard and soft skills relevant to the target role',
      ],
    });
  }

  // Low score overall alignment
  if (score < 45) {
    suggestions.push({
      id: 'alignment',
      category: 'experience',
      priority: 'critical',
      title: 'Tailor Your CV for This Specific Role',
      description: 'Your current CV reads as generic. Each application should have a version of your CV specifically customized for that role and company.',
      impact: 10,
      actionItems: [
        "Rewrite your professional summary to directly address this job's requirements",
        'Reorder bullet points so the most relevant experience appears first',
        'Remove or condense experience that is not relevant to this role',
        "Use the company's language and values as a mirror for your own descriptions",
      ],
    });
  }

  // Good score — formatting polish
  if (score >= 70) {
    suggestions.push({
      id: 'polish',
      category: 'format',
      priority: 'low',
      title: 'Final Formatting & Polish',
      description: 'Your CV is performing well! These refinements will ensure nothing gets lost in ATS parsing.',
      impact: 3,
      actionItems: [
        'Ensure all dates follow a consistent format (e.g., Jan 2022 – Present)',
        'Use standard section headings ATS recognises (Education, Experience, Skills)',
        'Avoid tables, columns, or text boxes — they confuse most ATS parsers',
        'Save and submit as .pdf unless the job posting requests .docx',
      ],
    });
  }

  // Education check
  const hasEducation = /\b(education|university|college|degree|bachelor|master|phd|msc|bsc|certification)\b/i.test(cvText);
  if (!hasEducation) {
    suggestions.push({
      id: 'education',
      category: 'format',
      priority: 'medium',
      title: 'Include an Education Section',
      description: 'Many roles have degree requirements that ATS filters enforce. Without an Education section your CV may be auto-rejected.',
      impact: 5,
      actionItems: [
        'Add your highest qualification, institution, and graduation year',
        'Include relevant certifications (AWS, Google Cloud, PMP, etc.)',
        'Add ongoing courses if they are directly relevant to the job',
        'Include GPA only if it is 3.5+ or 70%+',
      ],
    });
  }

  return suggestions.sort((a, b) => b.impact - a.impact).slice(0, 6);
}

// ---------- Main analyzer ----------
export function analyzeCV(cvText: string, jobDescription: string): ATSAnalysisResult {
  const jobFreq = extractKeywords(jobDescription);
  const cvLower = cvText.toLowerCase();

  // Sort job keywords by frequency (most important first), take top 40
  const topJobKeywords = Array.from(jobFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([kw]) => kw);

  const matchedKeywords: KeywordMatch[] = [];
  const missingKeywords: string[] = [];

  topJobKeywords.forEach(keyword => {
    if (cvLower.includes(keyword)) {
      const regex = new RegExp(
        `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
        'gi'
      );
      const hits = cvText.match(regex);
      const freq = hits ? hits.length : 1;
      matchedKeywords.push({
        keyword,
        frequency: freq,
        importance: getImportance(keyword, jobFreq.get(keyword) || 1),
      });
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Base score from keyword match rate
  const matchRate = matchedKeywords.length / Math.max(topJobKeywords.length, 1);
  let score = Math.round(matchRate * 75); // max 75 from keywords alone

  // Bonus scoring
  const wordCount = cvText.trim().split(/\s+/).length;
  if (wordCount > 400) score += 5;
  else if (wordCount > 250) score += 2;

  if (/\b(skills|technologies|tech stack)\b/i.test(cvText)) score += 6;
  if (/\d+\s*%|[$£€]\s*\d+/i.test(cvText)) score += 5;
  if (/\b(led|managed|developed|implemented|achieved)\b/i.test(cvText)) score += 4;
  if (/\b(education|university|bachelor|master|certification)\b/i.test(cvText)) score += 3;

  score = Math.min(100, Math.max(2, score));

  // Sub-scores
  const experienceScore = Math.min(100, Math.round(matchRate * 80 +
    (/\b(led|managed)\b/i.test(cvText) ? 10 : 0) +
    (/\d+%/i.test(cvText) ? 10 : 0)));
  const skillsScore = Math.min(100, Math.round(matchRate * 85 +
    (/\b(skills|technologies)\b/i.test(cvText) ? 15 : 0)));
  const formattingScore = Math.min(100, Math.round(
    55 +
    (wordCount > 300 ? 15 : wordCount > 150 ? 8 : 0) +
    (/\b(education|experience|skills)\b/i.test(cvText) ? 15 : 0) +
    (/\b(summary|objective|profile)\b/i.test(cvText) ? 15 : 0)
  ));

  const suggestions = generateSuggestions(cvText, missingKeywords, score);

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 15),
    suggestions,
    wordCount,
    experienceScore,
    skillsScore,
    formattingScore,
  };
}

// ---------- Sample data for demo ----------
export const SAMPLE_CV = `John Smith
Senior Software Engineer
john.smith@email.com | LinkedIn: /in/johnsmith | GitHub: /johnsmith

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 6 years of experience building scalable web applications. Passionate about clean code, developer experience, and shipping products users love.

EXPERIENCE

Senior Software Engineer — TechCorp Inc.  (Jan 2022 – Present)
• Built and maintained microservices architecture serving 200k+ daily active users
• Optimized PostgreSQL queries reducing average response time by 62%
• Mentored 3 junior engineers and conducted technical interviews

Software Engineer — StartupXYZ  (Mar 2019 – Dec 2021)
• Developed full-stack features using React, Node.js, and TypeScript
• Implemented CI/CD pipelines with GitHub Actions, cutting deployment time by 45%
• Collaborated with product and design teams in agile sprints

SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frameworks: React, Next.js, Node.js, Express
Databases: PostgreSQL, MongoDB, Redis
Tools: Docker, Git, AWS, Jira, Figma

EDUCATION
Bachelor of Science in Computer Science — University of Cape Town (2018)
AWS Certified Developer – Associate (2023)`;

export const SAMPLE_JD = `Senior Full-Stack Engineer — GrowthAI (Remote)

We're looking for an experienced Full-Stack Engineer to join our growing team.

Requirements:
• 5+ years of experience with React and TypeScript
• Strong proficiency in Node.js and RESTful API design
• Experience with cloud platforms (AWS, GCP, or Azure)
• Familiarity with Docker, Kubernetes, and CI/CD pipelines
• Experience with PostgreSQL or other relational databases
• Understanding of microservices architecture
• Experience with agile methodologies and cross-functional collaboration

Nice to have:
• Experience with machine learning pipelines or AI tooling
• Knowledge of GraphQL
• Open-source contributions

What you'll do:
• Architect and build scalable full-stack features end-to-end
• Collaborate closely with product managers and designers
• Conduct code reviews and mentor junior team members
• Drive technical decisions and improve engineering standards
• Participate in on-call rotation and incident response`;

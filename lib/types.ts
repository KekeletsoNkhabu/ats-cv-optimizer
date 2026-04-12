// lib/types.ts

export type Priority = "critical" | "high" | "medium" | "low";
export type SuggestionCategory =
  | "keywords"
  | "format"
  | "content"
  | "skills"
  | "experience";
export type KeywordImportance = "critical" | "high" | "medium" | "low";
export type PlanId = "free" | "pro" | "expert";

export interface KeywordMatch {
  keyword: string;
  frequency: number;
  importance: KeywordImportance;
}

export interface Suggestion {
  id: string;
  category: SuggestionCategory;
  priority: Priority;
  title: string;
  description: string;
  impact: number;
  actionItems: string[];
}

export interface ATSAnalysisResult {
  score: number;
  matchedKeywords: KeywordMatch[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  wordCount: number;
  experienceScore: number;
  skillsScore: number;
  formattingScore: number;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface AppContextType {
  cvText: string;
  cvFileName: string;
  jobDescription: string;
  analysisResult: ATSAnalysisResult | null;
  isAnalyzing: boolean;
  tailoredCV: string;
  isTailoring: boolean;
  selectedPlan: PlanId | null;
  hasPurchased: boolean;
  setCvText: (text: string) => void;
  setCvFileName: (name: string) => void;
  setJobDescription: (desc: string) => void;
  setAnalysisResult: (result: ATSAnalysisResult | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setTailoredCV: (cv: string) => void;
  setIsTailoring: (v: boolean) => void;
  setSelectedPlan: (plan: PlanId | null) => void;
  setHasPurchased: (v: boolean) => void;
}

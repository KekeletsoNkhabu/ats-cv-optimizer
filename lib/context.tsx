"use client";

import React, { createContext, useContext, useState } from "react";
import { AppContextType, ATSAnalysisResult, PlanId } from "./types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cvText, setCvText] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] =
    useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tailoredCV, setTailoredCV] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  return (
    <AppContext.Provider
      value={{
        cvText,
        setCvText,
        cvFileName,
        setCvFileName,
        jobDescription,
        setJobDescription,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        tailoredCV,
        setTailoredCV,
        isTailoring,
        setIsTailoring,
        selectedPlan,
        setSelectedPlan,
        hasPurchased,
        setHasPurchased,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

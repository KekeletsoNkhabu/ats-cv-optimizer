'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import ScoreCard from '@/components/results/ScoreCard';
import KeywordList from '@/components/results/KeywordList';
import SuggestionsPanel from '@/components/results/SuggestionsPanel';
import { useApp } from '@/lib/context';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ResultsPage() {
  const router = useRouter();
  const { analysisResult, isAnalyzing } = useApp();

  useEffect(() => {
    if (!analysisResult && !isAnalyzing) {
      router.replace('/dashboard');
    }
  }, [analysisResult, isAnalyzing, router]);

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-8 h-8 rounded-full border-2 border-accent-green border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-28 relative">
        {/* Background */}
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-accent-blue/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[200px] bg-accent-green/4 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm group"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <span className="text-border-strong hidden sm:block">|</span>
              <h1 className="font-display text-xl font-bold">Analysis Results</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/25 text-accent-green text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                Complete
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-border text-sm hover:border-border-strong transition-all duration-200 hover:bg-bg-card"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
                Re-analyze
              </Link>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm hover:bg-accent-green/20 transition-all duration-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export Report
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
            {/* Score card */}
            <motion.div variants={fadeUp}>
              <ScoreCard result={analysisResult} />
            </motion.div>

            {/* Keywords grid */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <KeywordList type="matched" keywords={analysisResult.matchedKeywords} />
              <KeywordList type="missing" keywords={analysisResult.missingKeywords} />
            </motion.div>

            {/* Suggestions */}
            <motion.div variants={fadeUp}>
              <SuggestionsPanel suggestions={analysisResult.suggestions} />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

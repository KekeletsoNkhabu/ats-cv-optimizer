'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import UploadCard from '@/components/dashboard/UploadCard';
import JobInput from '@/components/dashboard/JobInput';
import { useApp } from '@/lib/context';
import { analyzeCV } from '@/lib/ats-analyzer';

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { cvText, jobDescription, setAnalysisResult, setIsAnalyzing, isAnalyzing } = useApp();
  const [error, setError] = useState('');

  const canAnalyze = cvText.trim().length > 0 && jobDescription.trim().length > 0 && !isAnalyzing;

  async function handleAnalyze() {
    if (!cvText.trim()) { setError('Please add your CV content first.'); return; }
    if (!jobDescription.trim()) { setError('Please add a job description first.'); return; }
    setError('');
    setIsAnalyzing(true);
    // Simulate processing
    await new Promise(r => setTimeout(r, 2200));
    const result = analyzeCV(cvText, jobDescription);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    router.push('/results');
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 relative">
        {/* Background glow */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bg-elevated border border-border text-sm text-accent-green font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent-green badge-pulse" />
              Analyzer ready
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-4">
              Optimize Your{' '}
              <span className="gradient-text">CV</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
              Upload your CV and paste the job description. We'll score your ATS match and show you exactly how to improve.
            </p>
          </motion.div>

          {/* Two-column input area */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6"
          >
            <UploadCard />
            <JobInput />
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent-red text-sm text-center mb-4"
            >
              ⚠ {error}
            </motion.p>
          )}

          {/* Analyze button */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              whileHover={{ scale: canAnalyze ? 1.025 : 1, y: canAnalyze ? -2 : 0 }}
              whileTap={{ scale: canAnalyze ? 0.975 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`
                relative overflow-hidden flex items-center gap-3 px-10 py-4 rounded-2xl
                font-display font-bold text-lg tracking-tight transition-all duration-300
                ${canAnalyze
                  ? 'bg-accent-green text-bg-base shadow-glow-green cursor-pointer hover:shadow-[0_0_60px_rgba(34,197,94,0.5)]'
                  : 'bg-bg-elevated text-text-muted cursor-not-allowed border border-border'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <Spinner />
                  <span>Analyzing your CV…</span>
                </>
              ) : (
                <>
                  <span>Analyze My CV</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
              {/* Shine sweep on hover */}
              {canAnalyze && !isAnalyzing && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                />
              )}
            </motion.button>

            {isAnalyzing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-text-muted text-sm"
              >
                Scanning keywords, calculating score…
              </motion.p>
            )}

            {!cvText.trim() && !jobDescription.trim() && !isAnalyzing && (
              <p className="text-text-muted text-sm">
                Fill in both fields above to get started
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}

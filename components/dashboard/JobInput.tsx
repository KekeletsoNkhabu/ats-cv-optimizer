'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/context';
import { SAMPLE_JD } from '@/lib/ats-analyzer';

export default function JobInput() {
  const { jobDescription, setJobDescription } = useApp();
  const hasContent = jobDescription.trim().length > 0;
  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-full min-h-[420px] shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/25 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-sm text-text-primary">Job Description</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setJobDescription(SAMPLE_JD)}
            className="text-xs text-accent-blue hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-accent-blue/10 border border-accent-blue/20 hover:border-accent-blue/40"
          >
            Load sample
          </button>
          {hasContent && (
            <button
              onClick={() => setJobDescription('')}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-bg-elevated"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 p-4">
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here…&#10;&#10;Include: role summary, requirements, responsibilities, nice-to-haves. The more detail you provide, the more accurate your ATS score will be."
          className="w-full h-full min-h-[300px] resize-none bg-transparent text-text-primary placeholder-text-muted text-sm leading-relaxed outline-none"
          spellCheck={false}
        />
      </div>

      {/* Tips */}
      {!hasContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-4 mb-4 px-4 py-3 rounded-xl bg-bg-elevated border border-border-subtle"
        >
          <p className="text-text-muted text-xs leading-relaxed">
            <span className="text-accent-blue font-medium">💡 Pro tip:</span> Paste the entire job posting including the "nice to have" section — ATS systems scan every requirement.
          </p>
        </motion.div>
      )}

      {/* Status bar */}
      <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between">
        <span className={`text-xs ${hasContent ? 'text-accent-blue' : 'text-text-muted'}`}>
          {hasContent
            ? `✓ ${wordCount} words detected`
            : 'No job description'
          }
        </span>
        {hasContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span className="text-xs text-accent-blue">Ready</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

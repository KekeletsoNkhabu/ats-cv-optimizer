'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suggestion, Priority, SuggestionCategory } from '@/lib/types';
import { getPriorityClass, getPriorityLabel, getCategoryIcon } from '@/lib/utils';

interface Props { suggestions: Suggestion[]; }

const categoryLabels: Record<SuggestionCategory, string> = {
  keywords: 'Keywords',
  format: 'Formatting',
  content: 'Content',
  skills: 'Skills',
  experience: 'Experience',
};

const priorityOrder: Record<Priority, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

function ImpactBar({ impact }: { impact: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted text-[10px] uppercase tracking-wide font-medium">Impact</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-sm transition-colors duration-200 ${
              i < impact
                ? impact >= 8 ? 'bg-accent-green' : impact >= 5 ? 'bg-accent-blue' : 'bg-accent-amber'
                : 'bg-bg-elevated border border-border-subtle'
            }`}
          />
        ))}
      </div>
      <span className="text-text-muted text-[10px] font-medium">{impact}/10</span>
    </div>
  );
}

function SuggestionCard({ suggestion, index }: { suggestion: Suggestion; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border border-border hover:border-border-strong rounded-xl overflow-hidden transition-all duration-200"
    >
      {/* Card header — click to toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3.5 px-5 py-4 text-left hover:bg-bg-elevated/40 transition-colors duration-200"
      >
        {/* Category icon */}
        <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-base flex-shrink-0 mt-0.5">
          {getCategoryIcon(suggestion.category)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getPriorityClass(suggestion.priority)}`}>
              <span className="w-1 h-1 rounded-full bg-current" />
              {getPriorityLabel(suggestion.priority)}
            </span>
            <span className="text-text-muted text-[10px] uppercase tracking-wide">
              {categoryLabels[suggestion.category]}
            </span>
          </div>

          {/* Title */}
          <p className="font-display font-bold text-sm text-text-primary leading-snug">
            {suggestion.title}
          </p>
        </div>

        {/* Chevron */}
        <motion.svg
          className="w-4 h-4 text-text-muted flex-shrink-0 mt-1"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border-subtle">
              {/* Impact bar */}
              <div className="mb-3.5">
                <ImpactBar impact={suggestion.impact} />
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {suggestion.description}
              </p>

              {/* Action items */}
              <div className="space-y-2">
                <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-2.5">
                  Action Items
                </p>
                {suggestion.actionItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2.5 group"
                  >
                    <div className="w-5 h-5 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-accent-green/30 transition-colors">
                      <svg className="w-2.5 h-2.5 text-accent-green opacity-60" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SuggestionsPanel({ suggestions }: Props) {
  const sorted = [...suggestions].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  const criticalCount = sorted.filter(s => s.priority === 'critical').length;
  const highCount = sorted.filter(s => s.priority === 'high').length;

  return (
    <div className="glass-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/25 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-text-primary">Improvement Suggestions</h3>
            <p className="text-text-muted text-[11px]">{sorted.length} recommendations · sorted by priority</p>
          </div>
        </div>

        {/* Summary chips */}
        <div className="hidden sm:flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold priority-badge-critical">
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold priority-badge-high">
              {highCount} high
            </span>
          )}
        </div>
      </div>

      {/* Suggestions list */}
      <div className="p-4 space-y-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mb-3 text-2xl">
              🏆
            </div>
            <p className="text-text-secondary font-medium">Your CV is in great shape!</p>
            <p className="text-text-muted text-sm mt-1">No major improvements needed.</p>
          </div>
        ) : (
          sorted.map((s, i) => (
            <SuggestionCard key={s.id} suggestion={s} index={i} />
          ))
        )}
      </div>
    </div>
  );
}

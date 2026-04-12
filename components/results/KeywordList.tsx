'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeywordMatch, KeywordImportance } from '@/lib/types';

interface Props {
  type: 'matched' | 'missing';
  keywords: KeywordMatch[] | string[];
}

const importanceConfig: Record<KeywordImportance, { label: string; dot: string }> = {
  critical: { label: 'Critical', dot: 'bg-accent-red' },
  high: { label: 'High', dot: 'bg-accent-amber' },
  medium: { label: 'Medium', dot: 'bg-accent-blue' },
  low: { label: 'Low', dot: 'bg-text-muted' },
};

function MatchedChip({ kw }: { kw: KeywordMatch }) {
  const imp = importanceConfig[kw.importance];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 hover:border-accent-green/40 hover:bg-accent-green/15 transition-all duration-200 cursor-default"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${imp.dot} flex-shrink-0`} />
      <span className="text-accent-green text-xs font-medium capitalize">{kw.keyword}</span>
      {kw.frequency > 1 && (
        <span className="text-accent-green/50 text-[10px] font-bold">×{kw.frequency}</span>
      )}
    </motion.div>
  );
}

function MissingChip({ keyword }: { keyword: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-red/8 border border-accent-red/20 hover:border-accent-red/35 hover:bg-accent-red/12 transition-all duration-200 cursor-default"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent-red/60 flex-shrink-0" />
      <span className="text-accent-red/80 text-xs font-medium capitalize">{keyword}</span>
    </motion.div>
  );
}

export default function KeywordList({ type, keywords }: Props) {
  const [filter, setFilter] = useState<KeywordImportance | 'all'>('all');
  const isMatched = type === 'matched';

  const matched = isMatched ? (keywords as KeywordMatch[]) : [];
  const missing = !isMatched ? (keywords as string[]) : [];

  const filtered = isMatched
    ? (filter === 'all' ? matched : matched.filter(k => k.importance === filter))
    : missing;

  const importanceCounts = isMatched
    ? (['critical', 'high', 'medium'] as KeywordImportance[]).map(imp => ({
        imp,
        count: matched.filter(k => k.importance === imp).length,
      }))
    : [];

  return (
    <div className="glass-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
            isMatched ? 'bg-accent-green/12 border border-accent-green/25' : 'bg-accent-red/12 border border-accent-red/25'
          }`}>
            {isMatched ? '✓' : '✗'}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-text-primary">
              {isMatched ? 'Matched Keywords' : 'Missing Keywords'}
            </h3>
            <p className="text-text-muted text-[11px]">
              {isMatched
                ? `${matched.length} found in your CV`
                : `${missing.length} to add`
              }
            </p>
          </div>
        </div>

        {/* Count badge */}
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
          isMatched
            ? 'bg-accent-green/12 text-accent-green border border-accent-green/25'
            : 'bg-accent-red/12 text-accent-red border border-accent-red/25'
        }`}>
          {isMatched ? matched.length : missing.length}
        </span>
      </div>

      {/* Filter tabs (matched only) */}
      {isMatched && importanceCounts.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-3 border-b border-border-subtle overflow-x-auto">
          {(['all', 'critical', 'high', 'medium'] as const).map(f => {
            const count = f === 'all' ? matched.length : matched.filter(k => k.importance === f).length;
            if (f !== 'all' && count === 0) return null;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${
                  filter === f
                    ? 'bg-bg-elevated border border-border text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {f} {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Keywords */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center mb-3 text-lg">
                {isMatched ? '🎉' : '✅'}
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {isMatched
                  ? 'No keywords match this filter'
                  : 'No missing keywords!'
                }
              </p>
              <p className="text-text-muted text-xs mt-1">
                {isMatched
                  ? 'Try selecting "All" to see all matched keywords'
                  : 'Your CV covers all detected job requirements'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="keywords"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2"
            >
              {isMatched
                ? (filtered as KeywordMatch[]).map(kw => <MatchedChip key={kw.keyword} kw={kw} />)
                : (filtered as string[]).map(kw => <MissingChip key={kw} keyword={kw} />)
              }
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper text for missing */}
        {!isMatched && missing.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-text-muted text-xs leading-relaxed border-t border-border-subtle pt-4"
          >
            💡 Incorporate these keywords naturally into your experience bullets and skills section to improve your ATS match rate.
          </motion.p>
        )}
      </div>
    </div>
  );
}

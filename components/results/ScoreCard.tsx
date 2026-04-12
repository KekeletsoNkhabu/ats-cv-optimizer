'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ATSAnalysisResult } from '@/lib/types';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface Props { result: ATSAnalysisResult; }

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AnimatedNumber({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = (ts: number, startTs: number) => {
      const progress = Math.min((ts - startTs) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(ts2 => step(ts2, startTs));
    };
    requestAnimationFrame(ts => step(ts, ts));
  }, [target]);
  return <>{display}</>;
}

function SubScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-text-secondary text-xs font-medium">{label}</span>
        <span className="text-text-primary text-xs font-bold tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-base overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${value}%` : 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ result }: Props) {
  const { score, wordCount, experienceScore, skillsScore, formattingScore } = result;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const offset = CIRCUMFERENCE * (1 - score / 100);

  const matchRate = Math.round(
    result.matchedKeywords.length /
    Math.max(result.matchedKeywords.length + result.missingKeywords.length, 1) * 100
  );

  return (
    <div className="glass-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          {/* Left: Ring */}
          <div className="flex flex-col items-center lg:items-start gap-6 lg:flex-row">
            {/* Circular score */}
            <div className="relative flex-shrink-0">
              {/* Outer glow */}
              <div
                className="absolute -inset-4 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ backgroundColor: color }}
              />
              <svg width="160" height="160" viewBox="0 0 140 140" className="relative">
                {/* Background track */}
                <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                {/* Progress arc */}
                <motion.circle
                  cx="70" cy="70" r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={{ strokeDashoffset: CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                  transform="rotate(-90 70 70)"
                  style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                />
                {/* Center text */}
                <text x="70" y="62" textAnchor="middle" fill="white" fontSize="32" fontWeight="800" fontFamily="var(--font-syne)">
                  <AnimatedNumber target={score} />
                </text>
                <text x="70" y="80" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-jakarta)">
                  / 100
                </text>
              </svg>

              {/* Label badge */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border"
                style={{ color, borderColor: `${color}50`, backgroundColor: `${color}15` }}
              >
                {label}
              </div>
            </div>

            {/* Stats column */}
            <div className="flex flex-col gap-3 min-w-[160px]">
              {[
                { label: 'Keyword match', value: `${matchRate}%`, color: 'text-accent-green' },
                { label: 'Keywords found', value: result.matchedKeywords.length, color: 'text-accent-blue' },
                { label: 'Keywords missing', value: result.missingKeywords.length, color: 'text-accent-red' },
                { label: 'CV word count', value: wordCount, color: 'text-text-secondary' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between gap-4">
                  <span className="text-text-muted text-xs">{stat.label}</span>
                  <span className={`font-display font-bold text-sm ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px self-stretch bg-border-subtle mx-2" />

          {/* Right: Sub-scores */}
          <div className="flex-1 w-full space-y-5">
            <div>
              <h3 className="font-display font-bold text-base text-text-primary mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                <SubScoreBar label="Keyword Alignment" value={matchRate} color={getScoreColor(matchRate)} />
                <SubScoreBar label="Experience Quality" value={experienceScore} color={getScoreColor(experienceScore)} />
                <SubScoreBar label="Skills Coverage" value={skillsScore} color={getScoreColor(skillsScore)} />
                <SubScoreBar label="CV Formatting" value={formattingScore} color={getScoreColor(formattingScore)} />
              </div>
            </div>

            {/* Improvement hint */}
            {score < 80 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl bg-bg-elevated border border-border-subtle"
              >
                <p className="text-text-secondary text-sm leading-relaxed">
                  <span className="text-text-primary font-semibold">
                    {80 - score} points to a strong match.
                  </span>{' '}
                  Follow the suggestions below to close the gap and significantly improve your interview chances.
                </p>
              </motion.div>
            )}
            {score >= 80 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl bg-accent-green/8 border border-accent-green/20"
              >
                <p className="text-text-secondary text-sm leading-relaxed">
                  <span className="text-accent-green font-semibold">Excellent match! 🎉</span>{' '}
                  Your CV is highly aligned with this role. Review any remaining suggestions for final polish.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

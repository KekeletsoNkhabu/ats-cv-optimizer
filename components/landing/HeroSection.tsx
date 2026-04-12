'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function FloatingScorePreview() {
  return (
    <motion.div
      className="relative mx-auto lg:mx-0 w-full max-w-[420px]"
      initial={{ opacity: 0, x: 40, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Glow behind card */}
      <div className="absolute -inset-8 bg-accent-green/8 blur-[60px] rounded-full pointer-events-none" />

      {/* Main preview card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative glass-card rounded-2xl p-6 shadow-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wide">ATS Analysis</p>
            <p className="text-text-primary font-display font-bold text-sm mt-0.5">Senior React Engineer</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-accent-green/15 text-accent-green text-xs font-semibold border border-accent-green/25">
            Complete
          </span>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
              <motion.circle
                cx="40" cy="40" r="32"
                fill="none" stroke="#22C55E" strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 32}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 32 * (1 - 0.78)}` }}
                transition={{ delay: 0.8, duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="font-display font-bold text-xl text-text-primary leading-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                78
              </motion.span>
              <span className="text-text-muted text-[10px]">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {[
              { label: 'Keywords', value: 84 },
              { label: 'Experience', value: 72 },
              { label: 'Formatting', value: 90 },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">{item.label}</span>
                  <span className="text-text-secondary font-medium">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-green rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.9 + i * 0.12, duration: 0.9, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword chips */}
        <div>
          <p className="text-text-muted text-xs mb-2 font-medium">Matched keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js', 'AWS', '+12 more'].map(kw => (
              <span key={kw} className="px-2 py-0.5 rounded-md bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating suggestion card */}
      <motion.div
        animate={{ y: [4, -6, 4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-6 -right-4 sm:-right-8 glass-card rounded-xl p-3 max-w-[190px] shadow-card"
      >
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent-amber/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[10px]">💡</span>
          </div>
          <div>
            <p className="text-text-primary text-xs font-semibold">Add missing keywords</p>
            <p className="text-text-muted text-[10px] mt-0.5">Docker, CI/CD, Kubernetes</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-base pointer-events-none" />
      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-green/7 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-accent-blue/6 blur-[100px] rounded-full pointer-events-none" />

      {/* Decorative corner lines */}
      <div className="absolute top-20 left-8 w-px h-32 bg-gradient-to-b from-transparent via-accent-green/30 to-transparent hidden xl:block" />
      <div className="absolute top-20 right-8 w-px h-32 bg-gradient-to-b from-transparent via-accent-blue/30 to-transparent hidden xl:block" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: text */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            {/* Badge */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated border border-border text-sm font-medium mb-7">
                <span className="w-2 h-2 rounded-full bg-accent-green badge-pulse" />
                <span className="text-text-secondary">AI-Powered CV Analysis</span>
                <span className="text-text-muted">•</span>
                <span className="text-accent-green">Free to try</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight mb-6"
            >
              <span className="gradient-text-white">Get Past the ATS.</span>
              <br />
              <span className="gradient-text">Land the Interview.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={item}
              className="text-text-secondary text-lg leading-relaxed mb-9 max-w-lg"
            >
              Instant ATS match scoring, keyword gap analysis, and AI-powered suggestions — so you know exactly how to tailor your CV before hitting apply.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/dashboard"
                className="group relative overflow-hidden flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent-green text-bg-base font-display font-bold text-base transition-all duration-300 hover:shadow-glow-green"
              >
                <span className="relative z-10">Analyze My CV</span>
                <svg className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <motion.div
                  className="absolute inset-0 bg-white/15"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.45 }}
                />
              </Link>
              <Link
                href="/#how-it-works"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-bg-elevated border border-border text-text-primary font-display font-semibold text-base transition-all duration-200 hover:border-border-strong hover:bg-bg-card"
              >
                See how it works
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { value: '12k+', label: 'CVs analyzed' },
                { value: '85%', label: 'Match rate boost' },
                { value: '3×', label: 'More callbacks' },
              ].map(stat => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-xl text-text-primary">{stat.value}</span>
                  <span className="text-text-muted text-sm">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: floating preview */}
          <div className="relative flex justify-center lg:justify-end">
            <FloatingScorePreview />
          </div>
        </div>
      </div>
    </section>
  );
}

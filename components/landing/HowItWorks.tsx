'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Upload Your CV',
    description: 'Paste your CV text or upload a PDF. We extract and parse all the content automatically.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    color: 'accent-green',
  },
  {
    number: '02',
    title: 'Add Job Description',
    description: 'Paste the full job posting. Our engine identifies required skills, keywords, and role expectations.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    color: 'accent-blue',
  },
  {
    number: '03',
    title: 'Get Your ATS Score',
    description: 'Receive a detailed compatibility score with keyword match rate, sub-scores, and gap analysis.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: 'accent-purple',
  },
  {
    number: '04',
    title: 'Improve & Reapply',
    description: 'Follow the prioritized suggestions, update your CV, and re-analyze until your score hits 80+.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: 'accent-green',
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  'accent-green': {
    text: 'text-accent-green',
    bg: 'bg-accent-green/10',
    border: 'border-accent-green/25',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
  'accent-blue': {
    text: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
    border: 'border-accent-blue/25',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.15)]',
  },
  'accent-purple': {
    text: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
    border: 'border-accent-purple/25',
    glow: 'shadow-[0_0_20px_rgba(167,139,250,0.15)]',
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-bg-surface/30 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-accent-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-elevated border border-border text-xs font-medium text-text-secondary uppercase tracking-wider mb-5">
            How it works
          </span>
          <h2 className="font-display text-4xl sm:text-[2.75rem] font-bold mb-4 leading-tight">
            From upload to offer
            <br />
            <span className="gradient-text">in four steps</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            The entire process takes less than two minutes. No account needed to get started.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {steps.map((step, idx) => {
            const c = colorMap[step.color] ?? colorMap['accent-green'];
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="relative glass-card rounded-2xl p-6 border border-border hover:border-border-strong transition-all duration-300 shadow-card group"
              >
                {/* Step connector line (desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-2 w-4 h-px bg-gradient-to-r from-border to-transparent z-10" />
                )}

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${c.bg} border ${c.border} ${c.text} transition-all duration-300 group-hover:${c.glow}`}>
                  {step.icon}
                </div>

                {/* Step number */}
                <span className={`font-display font-extrabold text-4xl ${c.text} opacity-20 absolute top-5 right-5 leading-none pointer-events-none`}>
                  {step.number}
                </span>

                <h3 className="font-display font-bold text-base text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA inline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <Link
            href="/dashboard"
            className="group relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-accent-green text-bg-base font-display font-bold transition-all duration-300 hover:shadow-glow-green"
          >
            <span className="relative z-10">Start analyzing for free</span>
            <svg className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <motion.div className="absolute inset-0 bg-white/15" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.45 }} />
          </Link>
          <p className="text-text-muted text-sm mt-3">No sign-up required · Free forever</p>
        </motion.div>
      </div>
    </section>
  );
}

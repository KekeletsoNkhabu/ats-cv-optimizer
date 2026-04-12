'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* Large central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] bg-accent-green/8 blur-[140px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/25 text-accent-green text-sm font-medium mb-7">
            <span className="w-2 h-2 rounded-full bg-accent-green badge-pulse" />
            Ready to get started?
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            <span className="gradient-text-white">Stop guessing.</span>
            <br />
            <span className="gradient-text">Start optimizing.</span>
          </h2>

          <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands of job seekers who use ATS Optimizer to get more interviews. It takes two minutes and it's completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="group relative overflow-hidden flex items-center gap-2.5 px-8 py-4 rounded-xl bg-accent-green text-bg-base font-display font-bold text-lg transition-all duration-300 hover:shadow-glow-green w-full sm:w-auto justify-center"
            >
              <span className="relative z-10">Analyze My CV Now</span>
              <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <motion.div className="absolute inset-0 bg-white/15" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.45 }} />
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-9 text-text-muted text-sm">
            {['✓ No account required', '✓ Instant results', '✓ 100% private', '✓ Free forever'].map(item => (
              <span key={item} className="text-text-secondary">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎯',
    title: 'ATS Score Analysis',
    description: 'Get an instant 0–100 compatibility score showing how well your CV matches the job\'s ATS filters.',
    color: 'text-accent-green',
    border: 'hover:border-accent-green/40',
    glow: 'group-hover:bg-accent-green/5',
  },
  {
    icon: '🔍',
    title: 'Keyword Detection',
    description: 'Instantly see which keywords from the job description are present in — or missing from — your CV.',
    color: 'text-accent-blue',
    border: 'hover:border-accent-blue/40',
    glow: 'group-hover:bg-accent-blue/5',
  },
  {
    icon: '💡',
    title: 'Smart Suggestions',
    description: 'Receive prioritized, actionable recommendations with clear impact scores to improve your match rate.',
    color: 'text-accent-purple',
    border: 'hover:border-accent-purple/40',
    glow: 'group-hover:bg-accent-purple/5',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description: 'Analysis completes in seconds. No waiting, no account required — just paste and go.',
    color: 'text-accent-amber',
    border: 'hover:border-accent-amber/40',
    glow: 'group-hover:bg-accent-amber/5',
  },
  {
    icon: '📊',
    title: 'Detailed Breakdown',
    description: 'View separate scores for keywords, experience quality, and formatting — pinpoint exactly where to focus.',
    color: 'text-accent-green',
    border: 'hover:border-accent-green/40',
    glow: 'group-hover:bg-accent-green/5',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'All analysis runs locally in your browser. Your CV and job data never leave your device.',
    color: 'text-accent-blue',
    border: 'hover:border-accent-blue/40',
    glow: 'group-hover:bg-accent-blue/5',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[400px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />

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
            Features
          </span>
          <h2 className="font-display text-4xl sm:text-[2.75rem] font-bold mb-4 leading-tight">
            Everything you need to
            <br />
            <span className="gradient-text">ace the ATS</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            A complete toolkit for understanding and beating applicant tracking systems — no guesswork required.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map(feature => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={`group relative glass-card rounded-2xl p-6 border border-border transition-all duration-300 cursor-default ${feature.border} shadow-card hover:shadow-card-hover`}
            >
              {/* Glow bg on hover */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${feature.glow}`} />

              <div className="relative">
                {/* Icon */}
                <div className="text-3xl mb-4">{feature.icon}</div>

                {/* Title */}
                <h3 className={`font-display font-bold text-lg mb-2 ${feature.color} transition-colors duration-200`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

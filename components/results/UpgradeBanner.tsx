"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  score: number;
}

export default function UpgradeBanner({ score }: Props) {
  const isLow = score < 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-accent-green/30 shadow-glow-green"
      style={{
        background:
          "linear-gradient(135deg, rgba(34,197,94,0.09) 0%, rgba(14,14,20,0.9) 60%, rgba(96,165,250,0.06) 100%)",
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Glow top-left */}
      <div className="absolute -top-8 -left-8 w-40 h-40 bg-accent-green/15 blur-[50px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-6 py-5">
        {/* Left content */}
        <div className="flex items-start gap-4">
          {/* Gemini icon */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-blue/12 border border-accent-blue/25 flex items-center justify-center text-xl mt-0.5">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-display font-bold text-base text-text-primary">
                Let AI rewrite your CV for this exact job
              </span>
              <span className="px-2 py-0.5 rounded-md bg-accent-amber/12 border border-accent-amber/25 text-accent-amber text-[10px] font-bold uppercase tracking-wide">
                R130 one-time
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
              {isLow
                ? `Your score is ${score}/100. Groq (Llama 3.3 70B) will rewrite your CV with the exact keywords, phrasing, and impact language needed to pass ATS filters for this role.`
                : `Groq (Llama 3.3 70B) will enhance your already-strong CV — weaving in missing keywords, sharpening bullet points, and optimizing your summary to push your score toward 90+.`}
            </p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {["⚡ Instant delivery", "🔒 Secure payment", "↩ 24h refund"].map(
                (b) => (
                  <span key={b} className="text-text-muted text-xs">
                    {b}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <Link href="/tailor">
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-bg-base font-display font-bold text-sm whitespace-nowrap transition-all duration-300 hover:shadow-glow-green-sm cursor-pointer"
            >
              <span className="relative z-10">Get my tailored CV →</span>
              <motion.div
                className="absolute inset-0 bg-white/15"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.45 }}
              />
            </motion.div>
          </Link>
          <p className="text-text-muted text-[10px] text-center mt-1.5">
            Powered by AI
          </p>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PLANS } from "@/lib/pricing";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-bg-surface/40 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent-green/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-elevated border border-border text-xs font-medium text-text-secondary uppercase tracking-wider mb-5">
            Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-[2.75rem] font-bold mb-4 leading-tight">
            Simple, transparent
            <br />
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Start free. Upgrade when you're ready to let AI do the heavy
            lifting.
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-accent-green shadow-glow-green"
                  : "border border-border glass-card shadow-card hover:border-border-strong"
              }`}
              style={
                plan.highlighted
                  ? {
                      background:
                        "linear-gradient(160deg, rgba(34,197,94,0.06) 0%, rgba(14,14,20,1) 60%)",
                    }
                  : {}
              }
            >
              {/* Popular badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 inset-x-0 py-1.5 text-center text-xs font-bold tracking-wide ${
                    plan.highlighted
                      ? "bg-accent-green text-bg-base"
                      : "bg-accent-purple/20 border-b border-accent-purple/25 text-accent-purple"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div
                className={`flex flex-col flex-1 p-7 ${plan.badge ? "pt-10" : ""}`}
              >
                {/* Plan name */}
                <div className="mb-5">
                  <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-6">
                  {plan.price === 0 ? (
                    <span className="font-display font-extrabold text-4xl text-text-primary">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="font-display font-extrabold text-4xl text-text-primary">
                        ${plan.price}
                      </span>
                      <span className="text-text-muted text-sm">
                        / {plan.period}
                      </span>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.highlighted
                            ? "bg-accent-green/20 text-accent-green"
                            : "bg-bg-elevated text-text-muted"
                        }`}
                      >
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-text-secondary text-sm leading-relaxed">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={
                    plan.id === "free" ? "/dashboard" : `/pricing#${plan.id}`
                  }
                  className={`group relative overflow-hidden w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-display font-bold text-sm transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-accent-green text-bg-base hover:shadow-glow-green-sm"
                      : "bg-bg-elevated border border-border text-text-primary hover:border-border-strong hover:bg-bg-card"
                  }`}
                >
                  <span className="relative z-10">{plan.cta}</span>
                  {plan.highlighted && (
                    <svg
                      className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                  {plan.highlighted && (
                    <motion.div
                      className="absolute inset-0 bg-white/15"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.45 }}
                    />
                  )}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-text-muted text-sm mt-8"
        >
          All plans include the full ATS analysis suite. No subscription unless
          you choose Expert.
          <br />
          Pro is a one-time payment per CV tailoring session.
        </motion.p>
      </div>
    </section>
  );
}

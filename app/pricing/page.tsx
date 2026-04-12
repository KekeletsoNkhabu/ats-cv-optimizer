"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PLANS } from "@/lib/pricing";
import { useApp } from "@/lib/context";
import { PlanId } from "@/lib/types";

const faqs = [
  {
    q: "What AI model is used to tailor my CV?",
    a: "We use Google Gemini 1.5 Flash — Google's advanced language model optimized for speed and quality. It's trained on millions of professional documents and understands what hiring managers and ATS systems are looking for.",
  },
  {
    q: "Will the AI invent experience I don't have?",
    a: "Never. The AI only works with information already in your CV. It enhances, reorders, and rewords your real experience to better match the job — it never fabricates qualifications, employers, or skills.",
  },
  {
    q: "How is Pro billed?",
    a: "Pro is a one-time payment of $7.99 per CV tailoring session. There is no subscription. Each time you want to tailor a CV for a different job, you pay once for that session.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — if you're unhappy with your tailored CV within 24 hours of purchase, contact us for a full refund. No questions asked.",
  },
  {
    q: "What format does the tailored CV come in?",
    a: "You receive your tailored CV as a text file (.txt) and as a print-ready HTML file you can open in any browser and print to PDF. Both are formatted professionally and ready to submit.",
  },
];

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, duration: 0.45 }}
      className="border-b border-border-subtle py-5"
    >
      <p className="font-display font-semibold text-sm text-text-primary mb-2">
        {q}
      </p>
      <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
    </motion.div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const { setSelectedPlan, analysisResult } = useApp();

  function handleSelectPlan(planId: PlanId, price: number) {
    if (price === 0) {
      router.push("/dashboard");
      return;
    }
    setSelectedPlan(planId);
    if (analysisResult) {
      router.push("/tailor");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 relative">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-accent-green/6 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-elevated border border-border text-xs font-medium text-text-secondary uppercase tracking-wider mb-5">
              Pricing
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              <span className="gradient-text-white">Start free.</span>
              <br />
              <span className="gradient-text">Go further with AI.</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              The full ATS analysis is always free. Upgrade to let AI rewrite
              your CV for the specific job you want.
            </p>
          </motion.div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
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
                          "linear-gradient(160deg, rgba(34,197,94,0.07) 0%, rgba(14,14,20,1) 60%)",
                      }
                    : {}
                }
              >
                {plan.badge && (
                  <div
                    className={`py-1.5 text-center text-xs font-bold tracking-wide ${
                      plan.highlighted
                        ? "bg-accent-green text-bg-base"
                        : "bg-accent-purple/20 border-b border-accent-purple/25 text-accent-purple"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div
                  className={`flex flex-col flex-1 p-7 ${plan.badge ? "pt-6" : ""}`}
                >
                  <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-5 leading-relaxed">
                    {plan.description}
                  </p>

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

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <div
                          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${plan.highlighted ? "bg-accent-green/20 text-accent-green" : "bg-bg-elevated text-text-muted"}`}
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

                  <motion.button
                    onClick={() => handleSelectPlan(plan.id, plan.price)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative overflow-hidden w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-sm transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-accent-green text-bg-base hover:shadow-glow-green-sm"
                        : "bg-bg-elevated border border-border text-text-primary hover:border-border-strong"
                    }`}
                  >
                    <span className="relative z-10">{plan.cta}</span>
                    {plan.highlighted && (
                      <>
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
                        <motion.div
                          className="absolute inset-0 bg-white/15"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.45 }}
                        />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display font-bold text-2xl text-center mb-8">
              Frequently asked questions
            </h2>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} i={i} />
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <p className="text-text-secondary mb-4">
              Still not sure? Start with the free ATS analysis first.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bg-elevated border border-border text-text-primary font-display font-semibold text-sm hover:border-border-strong transition-all"
            >
              Try free analysis →
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

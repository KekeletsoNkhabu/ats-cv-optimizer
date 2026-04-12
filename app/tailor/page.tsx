"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import PaymentModal from "@/components/tailor/PaymentModal";
import CVOutput from "@/components/tailor/CVOutput";
import { useApp } from "@/lib/context";
import { PLANS } from "@/lib/pricing";

type Stage = "upsell" | "paying" | "generating" | "done" | "error";

const generatingSteps = [
  { icon: "🔍", label: "Reading your CV and job description…" },
  { icon: "🎯", label: "Identifying key requirements and gaps…" },
  { icon: "✍️", label: "Rewriting experience bullets with impact…" },
  { icon: "⚡", label: "Optimizing keywords for ATS parsing…" },
  { icon: "✨", label: "Polishing professional summary…" },
  { icon: "🏁", label: "Finalizing your tailored CV…" },
];

function GeneratingAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => Math.min(s + 1, generatingSteps.length - 1));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card border border-border rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-card">
      {/* Animated AI orb */}
      <div className="relative w-20 h-20 mx-auto mb-7">
        <div className="absolute inset-0 rounded-full bg-accent-green/10 animate-pulse" />
        <svg
          className="w-20 h-20 -rotate-90 absolute inset-0"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="5"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#22C55E"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="213.6"
            animate={{ strokeDashoffset: [213.6, 53.4, 213.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.5))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {generatingSteps[step].icon}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <h3 className="font-display font-bold text-xl text-text-primary mb-2">
        AI is tailoring your CV
      </h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-text-muted text-sm mb-7"
        >
          {generatingSteps[step].label}
        </motion.p>
      </AnimatePresence>

      {/* Step progress */}
      <div className="flex items-center justify-center gap-1.5">
        {generatingSteps.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full bg-accent-green"
            animate={{
              width: i === step ? 24 : 6,
              height: 6,
              opacity: i <= step ? 1 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <p className="text-text-muted text-xs mt-5">
        This usually takes 10–20 seconds…
      </p>
    </div>
  );
}

function UpsellCard({
  onBuy,
  onBack,
}: {
  onBuy: () => void;
  onBack: () => void;
}) {
  const plan = PLANS.find((p) => p.id === "pro")!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/25 text-accent-green text-sm font-medium mb-5"
        >
          <span className="w-2 h-2 rounded-full bg-accent-green badge-pulse" />
          AI-Powered CV Tailoring
        </motion.div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
          Let AI rewrite your CV
          <br />
          <span className="gradient-text">for this exact role</span>
        </h1>
        <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto">
          Google Gemini will rewrite every section of your CV — keywords,
          bullets, summary — perfectly aligned to the job you're targeting.
        </p>
      </div>

      {/* Pro card */}
      <div
        className="border-2 border-accent-green rounded-2xl overflow-hidden shadow-glow-green mb-5"
        style={{
          background:
            "linear-gradient(160deg, rgba(34,197,94,0.07) 0%, rgba(14,14,20,1) 55%)",
        }}
      >
        {/* Badge */}
        <div className="bg-accent-green py-1.5 text-center text-xs font-bold text-bg-base">
          Most popular · One-time payment
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Left: info */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display font-extrabold text-4xl text-text-primary">
                  ${plan.price}
                </span>
                <span className="text-text-muted text-sm">one-time</span>
              </div>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-text-secondary text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: CTA */}
            <div className="sm:w-48 flex flex-col gap-3">
              <motion.button
                onClick={onBuy}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden w-full py-4 rounded-xl bg-accent-green text-bg-base font-display font-bold text-base transition-all duration-300 hover:shadow-glow-green"
              >
                <span className="relative z-10">Get my tailored CV →</span>
                <motion.div
                  className="absolute inset-0 bg-white/15"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.45 }}
                />
              </motion.button>

              <div className="space-y-1.5 text-center">
                {[
                  "🔒 Secure payment",
                  "↩ 24h refund guarantee",
                  "⚡ Instant delivery",
                ].map((t) => (
                  <p key={t} className="text-text-muted text-[11px]">
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before/after preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {[
          {
            label: "Before",
            color: "border-accent-red/20 bg-accent-red/5",
            labelColor: "text-accent-red",
            text: '"Responsible for building web features using React and managed deployments to AWS infrastructure."',
          },
          {
            label: "After (AI-tailored)",
            color: "border-accent-green/20 bg-accent-green/5",
            labelColor: "text-accent-green",
            text: '"Engineered 12 React micro-frontends deployed to AWS ECS, reducing time-to-market by 40% and improving team velocity across 3 squads."',
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-4 ${item.color}`}
          >
            <p className={`text-xs font-bold mb-2 ${item.labelColor}`}>
              {item.label}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed italic">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="w-full text-center text-text-muted text-sm hover:text-text-secondary transition-colors py-2"
      >
        ← Go back to results
      </button>
    </motion.div>
  );
}

export default function TailorPage() {
  const router = useRouter();
  const {
    cvText,
    jobDescription,
    tailoredCV,
    setTailoredCV,
    isTailoring,
    setIsTailoring,
    hasPurchased,
    setHasPurchased,
  } = useApp();
  const [stage, setStage] = useState<Stage>(
    hasPurchased && tailoredCV ? "done" : "upsell",
  );
  const [showPayment, setShowPayment] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const proPlan = PLANS.find((p) => p.id === "pro")!;

  useEffect(() => {
    if (!cvText.trim() || !jobDescription.trim()) {
      router.replace("/dashboard");
    }
  }, [cvText, jobDescription, router]);

  async function startGeneration() {
    setStage("generating");
    setIsTailoring(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      setTailoredCV(data.tailoredCV);
      setHasPurchased(true);
      setStage("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    } finally {
      setIsTailoring(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 relative">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-accent-green/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-8"
          >
            <Link
              href="/results"
              className="hover:text-text-secondary transition-colors"
            >
              Results
            </Link>
            <span>›</span>
            <span className="text-text-secondary">AI CV Tailoring</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Upsell */}
            {stage === "upsell" && (
              <motion.div
                key="upsell"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UpsellCard
                  onBuy={() => setShowPayment(true)}
                  onBack={() => router.push("/results")}
                />
              </motion.div>
            )}

            {/* Generating */}
            {stage === "generating" && (
              <motion.div
                key="gen"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <GeneratingAnimation />
              </motion.div>
            )}

            {/* Done */}
            {stage === "done" && tailoredCV && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Success banner */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-accent-green/10 border border-accent-green/25 mb-5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-accent-green/20 border border-accent-green/40 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5 9-9" />
                      </svg>
                    </div>
                    <p className="text-accent-green text-sm font-medium">
                      Your AI-tailored CV is ready!
                    </p>
                  </div>
                  <Link
                    href="/results"
                    className="text-text-muted text-xs hover:text-text-secondary transition-colors"
                  >
                    ← Back to results
                  </Link>
                </motion.div>

                <CVOutput cvMarkdown={tailoredCV} />
              </motion.div>
            )}

            {/* Error */}
            {stage === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/25 flex items-center justify-center mx-auto mb-5 text-3xl">
                  ⚠️
                </div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                  Generation failed
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {errorMsg}
                </p>
                {errorMsg.includes("API key") && (
                  <div className="text-left p-4 rounded-xl bg-bg-elevated border border-border mb-5">
                    <p className="text-text-secondary text-xs font-semibold mb-2">
                      Quick fix:
                    </p>
                    <ol className="text-text-muted text-xs space-y-1 list-decimal list-inside">
                      <li>
                        Visit{" "}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent-blue underline"
                        >
                          aistudio.google.com/app/apikey
                        </a>{" "}
                        (free)
                      </li>
                      <li>Create a new API key</li>
                      <li>
                        Copy{" "}
                        <code className="bg-bg-card px-1 rounded">
                          .env.example
                        </code>{" "}
                        to{" "}
                        <code className="bg-bg-card px-1 rounded">
                          .env.local
                        </code>
                      </li>
                      <li>
                        Paste your key as{" "}
                        <code className="bg-bg-card px-1 rounded">
                          GEMINI_API_KEY=…
                        </code>
                      </li>
                      <li>Restart the dev server</li>
                    </ol>
                  </div>
                )}
                <button
                  onClick={() => startGeneration()}
                  className="px-6 py-2.5 rounded-xl bg-bg-elevated border border-border text-text-primary font-semibold text-sm hover:border-border-strong transition-all"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Payment modal */}
      {showPayment && (
        <PaymentModal
          plan={{ name: proPlan.name, price: proPlan.price }}
          onSuccess={() => {
            setShowPayment(false);
            startGeneration();
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}

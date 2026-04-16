"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  plan: { name: string; price: number };
  onSuccess: () => void;
  onClose: () => void;
}

type Step = "form" | "processing" | "success";

function formatCard(val: string) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

const processingMessages = [
  "Verifying card details…",
  "Connecting to payment gateway…",
  "Authorising transaction…",
  "Confirming payment…",
];

export default function PaymentModal({ plan, onSuccess, onClose }: Props) {
  const [step, setStep] = useState<Step>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processingMsg, setProcessingMsg] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter the cardholder name";
    if (cardNumber.replace(/\s/g, "").length !== 16)
      e.card = "Enter a valid 16-digit card number";
    if (expiry.length !== 5) e.expiry = "Enter expiry as MM/YY";
    if (cvv.length < 3) e.cvv = "Enter a valid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setStep("processing");

    // Cycle through processing messages
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx += 1;
      if (idx < processingMessages.length) {
        setProcessingMsg(idx);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 700);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 3000));
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStep("success");

    // Auto-advance after showing success
    await new Promise((r) => setTimeout(r, 1600));
    onSuccess();
  }

  const inputCls = (field: string) =>
    `w-full bg-bg-elevated border rounded-xl px-4 py-3 text-text-primary text-sm outline-none transition-all duration-200 placeholder-text-muted ${
      errors[field]
        ? "border-accent-red/50 focus:border-accent-red"
        : "border-border focus:border-accent-green/50"
    }`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget && step === "form") onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="w-full max-w-md glass-card border border-border rounded-2xl overflow-hidden shadow-card"
          style={{ background: "#0E0E14" }}
        >
          {/* ── FORM STEP ─────────────────────────────────── */}
          {step === "form" && (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">
                    Complete your purchase
                  </h3>
                  <p className="text-text-muted text-xs mt-0.5">
                    Secure checkout · 256-bit SSL encryption
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Order summary */}
              <div className="mx-6 mt-5 mb-5 p-4 rounded-xl bg-accent-green/8 border border-accent-green/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-primary font-semibold text-sm">
                      {plan.name} — AI CV Tailoring
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      One-time · Instant delivery
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-extrabold text-xl text-accent-green">
                      R{plan.price}
                    </span>
                    <p className="text-text-muted text-xs">USD</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 pb-6 space-y-4">
                {/* Cardholder name */}
                <div>
                  <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                    Cardholder name
                  </label>
                  <input
                    className={inputCls("name")}
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setErrors((p) => ({ ...p, name: "" }))}
                  />
                  {errors.name && (
                    <p className="text-accent-red text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Card number */}
                <div>
                  <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      className={inputCls("card") + " pr-12"}
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCard(e.target.value))
                      }
                      onFocus={() => setErrors((p) => ({ ...p, card: "" }))}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      {/* Card brand icons (simplified) */}
                      <div className="w-8 h-5 rounded bg-bg-card border border-border flex items-center justify-center">
                        <span className="text-[8px] font-bold text-text-muted">
                          VISA
                        </span>
                      </div>
                      <div className="w-8 h-5 rounded bg-bg-card border border-border flex items-center justify-center">
                        <span className="text-[8px] font-bold text-text-muted">
                          MC
                        </span>
                      </div>
                    </div>
                  </div>
                  {errors.card && (
                    <p className="text-accent-red text-xs mt-1">
                      {errors.card}
                    </p>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                      Expiry
                    </label>
                    <input
                      className={inputCls("expiry")}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      onFocus={() => setErrors((p) => ({ ...p, expiry: "" }))}
                    />
                    {errors.expiry && (
                      <p className="text-accent-red text-xs mt-1">
                        {errors.expiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                      CVV
                    </label>
                    <input
                      className={inputCls("cvv")}
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      onFocus={() => setErrors((p) => ({ ...p, cvv: "" }))}
                    />
                    {errors.cvv && (
                      <p className="text-accent-red text-xs mt-1">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pay button */}
                <motion.button
                  onClick={handlePay}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden w-full py-3.5 rounded-xl bg-accent-green text-bg-base font-display font-bold text-base mt-1 transition-all duration-300 hover:shadow-glow-green-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Pay ${plan.price} now
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/15"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.45 }}
                  />
                </motion.button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  {[
                    "🔒 SSL Secure",
                    "✓ Instant delivery",
                    "↩ Refund guarantee",
                  ].map((b) => (
                    <span key={b} className="text-text-muted text-[10px]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PROCESSING STEP ───────────────────────────── */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              {/* Spinner ring */}
              <div className="relative w-16 h-16 mb-6">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="5"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="176"
                    animate={{ strokeDashoffset: [176, 44, 176] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(34,197,94,0.5))",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-accent-green"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="1"
                      y1="10"
                      x2="23"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-display font-bold text-lg text-text-primary mb-2">
                Processing payment
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={processingMsg}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-text-muted text-sm"
                >
                  {processingMessages[processingMsg]}
                </motion.p>
              </AnimatePresence>
              <div className="flex gap-1.5 mt-6">
                {processingMessages.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full bg-accent-green"
                    animate={{
                      width: i <= processingMsg ? 24 : 8,
                      opacity: i <= processingMsg ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── SUCCESS STEP ──────────────────────────────── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="w-16 h-16 rounded-full bg-accent-green/15 border-2 border-accent-green flex items-center justify-center mb-5"
                style={{ boxShadow: "0 0 40px rgba(34,197,94,0.3)" }}
              >
                <motion.svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-accent-green"
                >
                  <motion.path
                    d="M5 12l5 5 9-9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                </motion.svg>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display font-bold text-xl text-text-primary mb-1.5"
              >
                Payment confirmed!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-text-muted text-sm"
              >
                Starting AI CV generation…
              </motion.p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

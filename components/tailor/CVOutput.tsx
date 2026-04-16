"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  cvMarkdown: string;
}

// ── Markdown inline renderer ──────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="text-text-primary font-semibold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      p
    ),
  );
}

function renderMarkdown(md: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  md.split("\n").forEach((line, i) => {
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="font-display font-extrabold text-2xl text-text-primary mb-1 tracking-tight"
        >
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <div key={i} className="mt-5 mb-2">
          <h2 className="font-display font-bold text-[10px] text-accent-green uppercase tracking-widest">
            {line.slice(3)}
          </h2>
          <div className="h-px bg-gradient-to-r from-accent-green/40 to-transparent mt-1" />
        </div>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="font-display font-bold text-base text-text-primary mt-3 mb-1"
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-1 mb-1">
          <span className="mt-2 w-1 h-1 rounded-full bg-accent-green flex-shrink-0" />
          <p className="text-text-secondary text-sm leading-relaxed">
            {renderInline(line.slice(2))}
          </p>
        </div>,
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-text-secondary text-sm leading-relaxed mb-1">
          {renderInline(line)}
        </p>,
      );
    }
  });
  return elements;
}

// ── Professional PDF generator using jsPDF ────────────────────────────────────
async function downloadAsPDF(markdown: string) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const pageH = 297;
  const mL = 20; // left margin
  const mR = 20; // right margin
  const mT = 22; // top margin
  const mB = 20; // bottom margin
  const contentW = pageW - mL - mR;

  // ── Brand colours ──
  const GREEN = [22, 163, 74] as [number, number, number];
  const DARK = [13, 13, 19] as [number, number, number];
  const BODY = [55, 55, 65] as [number, number, number];
  const MUTED = [110, 110, 120] as [number, number, number];
  const LINE = [230, 230, 235] as [number, number, number];

  let y = mT;

  function checkPage(needed: number) {
    if (y + needed > pageH - mB) {
      doc.addPage();
      y = mT;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function setColor(rgb: [number, number, number]) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }

  function drawText(
    text: string,
    x: number,
    maxW: number,
    size: number,
    style: "normal" | "bold",
    color: [number, number, number],
    lineH: number,
  ): number {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    checkPage(lines.length * lineH + 2);
    doc.text(lines, x, y);
    return lines.length * lineH;
  }

  // ── Render bold/normal mixed line (for skills: **Category:** value) ────────
  function drawMixedLine(
    raw: string,
    x: number,
    maxW: number,
    size: number,
    lineH: number,
  ): number {
    // Detect **bold**: value pattern
    const boldMatch = raw.match(/^\*\*([^*]+)\*\*:?\s*(.*)/);
    if (boldMatch) {
      const boldPart = boldMatch[1].trim() + ":";
      const normalPart = " " + boldMatch[2].trim();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      setColor(DARK);
      const bw = doc.getTextWidth(boldPart);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      setColor(BODY);
      const available = maxW - bw;
      const wrappedNormal = doc.splitTextToSize(
        normalPart,
        available,
      ) as string[];

      checkPage(wrappedNormal.length * lineH + 2);

      // Bold label
      doc.setFont("helvetica", "bold");
      setColor(DARK);
      doc.text(boldPart, x, y);

      // Normal rest — first line same y, subsequent lines indented
      doc.setFont("helvetica", "normal");
      setColor(BODY);
      doc.text(wrappedNormal[0], x + bw, y);
      if (wrappedNormal.length > 1) {
        for (let n = 1; n < wrappedNormal.length; n++) {
          y += lineH;
          checkPage(lineH);
          doc.text(wrappedNormal[n], x + bw, y);
        }
      }
      return wrappedNormal.length * lineH;
    }
    // No bold pattern — render as normal
    return drawText(
      raw.replace(/\*\*([^*]+)\*\*/g, "$1"),
      x,
      maxW,
      size,
      "normal",
      BODY,
      lineH,
    );
  }

  // ── Parse and render ───────────────────────────────────────────────────────
  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Name  (# )
    if (line.startsWith("# ")) {
      const name = line.slice(2).trim();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      setColor(DARK);
      checkPage(12);
      doc.text(name, mL, y);
      y += 10;
      continue;
    }

    // Section heading  (## )
    if (line.startsWith("## ")) {
      y += 4;
      checkPage(9);
      const heading = line.slice(3).trim().toUpperCase();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
      doc.text(heading, mL, y);
      y += 2.5;
      // Green underline
      doc.setDrawColor(GREEN[0], GREEN[1], GREEN[2]);
      doc.setLineWidth(0.35);
      doc.line(mL, y, pageW - mR, y);
      y += 4;
      continue;
    }

    // Job title / sub-heading  (### )
    if (line.startsWith("### ")) {
      checkPage(7);
      const title = line.slice(4).trim();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor(DARK);
      doc.text(title, mL, y);
      y += 6;
      continue;
    }

    // Bullet point  (- )
    if (line.startsWith("- ")) {
      const text = line
        .slice(2)
        .trim()
        .replace(/\*\*([^*]+)\*\*/g, "$1");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setColor(BODY);
      const wrapped = doc.splitTextToSize(text, contentW - 6) as string[];
      checkPage(wrapped.length * 5 + 1);
      // Bullet dot
      doc.setFillColor(GREEN[0], GREEN[1], GREEN[2]);
      doc.circle(mL + 1.5, y - 1.2, 0.8, "F");
      doc.text(wrapped, mL + 5, y);
      y += wrapped.length * 5 + 1;
      continue;
    }

    // Bold/mixed line — e.g. **Languages:** Python, JS
    if (line.trim().startsWith("**")) {
      checkPage(6);
      const added = drawMixedLine(line.trim(), mL, contentW, 10, 5);
      y += added + 1;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      y += 2;
      continue;
    }

    // Regular text (contact line, plain paragraphs)
    const plain = line.replace(/\*\*([^*]+)\*\*/g, "$1");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(MUTED);
    const wrapped = doc.splitTextToSize(plain, contentW) as string[];
    checkPage(wrapped.length * 4.5 + 0.5);
    doc.text(wrapped, mL, y);
    y += wrapped.length * 4.5 + 0.5;
  }

  // ── Footer: thin line + page numbers ───────────────────────────────────────
  const totalPages = (
    doc as unknown as { internal: { getNumberOfPages: () => number } }
  ).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
    doc.setLineWidth(0.3);
    doc.line(mL, pageH - 12, pageW - mR, pageH - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(MUTED);
    doc.text(`Page ${p} of ${totalPages}`, pageW / 2, pageH - 7, {
      align: "center",
    });
  }

  // Extract name for filename
  const nameLine = lines.find((l) => l.startsWith("# "));
  const name = nameLine
    ? nameLine.slice(2).trim().replace(/\s+/g, "-")
    : "tailored-cv";
  doc.save(`${name}-tailored.pdf`);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CVOutput({ cvMarkdown }: Props) {
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(cvMarkdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handlePDF() {
    setPdfLoading(true);
    try {
      await downloadAsPDF(cvMarkdown);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="glass-card border border-accent-green/20 rounded-2xl overflow-hidden shadow-card"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border-subtle bg-accent-green/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-green/15 border border-accent-green/30 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-accent-green"
            >
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div>
            <p className="font-display font-bold text-sm text-text-primary">
              Your AI-Tailored CV
            </p>
            <p className="text-text-muted text-[11px]">
              Optimized for this specific role · Ready to download
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copy */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
              copied
                ? "bg-accent-green/15 border-accent-green/35 text-accent-green"
                : "bg-bg-elevated border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
            }`}
          >
            {copied ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5 9-9" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy text
              </>
            )}
          </motion.button>

          {/* Download PDF */}
          <motion.button
            onClick={handlePDF}
            disabled={pdfLoading}
            whileHover={{
              scale: pdfLoading ? 1 : 1.03,
              y: pdfLoading ? 0 : -1,
            }}
            whileTap={{ scale: pdfLoading ? 1 : 0.97 }}
            className={`group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-xs transition-all duration-300 ${
              pdfLoading
                ? "bg-accent-green/20 border border-accent-green/30 text-accent-green cursor-wait"
                : "bg-accent-green text-bg-base hover:shadow-glow-green-sm"
            }`}
          >
            {pdfLoading ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating PDF…
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download PDF
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
      </div>

      {/* CV preview */}
      <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">
        <div className="max-w-2xl mx-auto">{renderMarkdown(cvMarkdown)}</div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3.5 border-t border-border-subtle bg-bg-surface/50 flex flex-wrap items-center justify-between gap-2">
        <p className="text-text-muted text-xs">
          💡 The downloaded PDF is ATS-friendly — clean text-based layout, no
          images or tables.
        </p>
      </div>
    </motion.div>
  );
}

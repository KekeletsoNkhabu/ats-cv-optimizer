"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  cvMarkdown: string;
}

// ── Simple markdown-to-JSX renderer ──────────────────────────────────────────
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

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
          <h2 className="font-display font-bold text-sm text-accent-green uppercase tracking-widest">
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
    i++;
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Bold **text**
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

export default function CVOutput({ cvMarkdown }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(cvMarkdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([cvMarkdown], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tailored-cv.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadHTML() {
    const name = cvMarkdown.split("\n")[0].replace("# ", "").trim();
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name} — CV</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; font-size:11pt; line-height:1.6; color:#1a1a1a; max-width:800px; margin:0 auto; padding:32px 40px; }
  h1 { font-size:20pt; font-weight:700; color:#0d0d0d; margin-bottom:2px; }
  p.contact { font-size:9pt; color:#555; margin-bottom:16px; }
  h2 { font-size:9pt; font-weight:700; color:#16a34a; text-transform:uppercase; letter-spacing:.1em; margin:18px 0 4px; padding-bottom:4px; border-bottom:1.5px solid #d1fae5; }
  h3 { font-size:10.5pt; font-weight:600; color:#1a1a1a; margin:10px 0 2px; }
  ul { padding-left:14px; margin-bottom:6px; }
  li { font-size:10pt; color:#333; margin-bottom:2px; }
  strong { font-weight:600; color:#111; }
  @media print { body { padding:20px 28px; } }
</style>
</head>
<body>
${cvMarkdown
  .split("\n")
  .map((line) => {
    if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
    if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
    if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
    if (line.startsWith("- "))
      return `<ul><li>${line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</li></ul>`;
    if (line.trim() === "") return "<br/>";
    return `<p>${line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</p>`;
  })
  .join("\n")}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tailored-cv.html";
    a.click();
    URL.revokeObjectURL(url);
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
              Optimized for this specific role · Ready to use
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy text
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-bg-elevated text-text-secondary text-xs font-medium hover:border-border-strong hover:text-text-primary transition-all duration-200"
          >
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
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            .txt
          </motion.button>

          <motion.button
            onClick={handleDownloadHTML}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-xs font-medium hover:bg-accent-green/20 transition-all duration-200"
          >
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
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download HTML (print-ready)
          </motion.button>
        </div>
      </div>

      {/* CV content */}
      <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
        <div className="max-w-2xl mx-auto">{renderMarkdown(cvMarkdown)}</div>
      </div>

      {/* Footer hint */}
      <div className="px-6 py-3.5 border-t border-border-subtle bg-bg-surface/50 flex flex-wrap items-center justify-between gap-2">
        <p className="text-text-muted text-xs">
          💡 Download as HTML, open in browser, and print to PDF for best
          results.
        </p>
        <p className="text-text-muted text-xs">
          Powered by{" "}
          <span className="text-accent-blue">Google Gemini 1.5 Flash</span>
        </p>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';

type Tab = 'paste' | 'upload';

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 text-accent-blue" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function JobInput() {
  const { jobDescription, setJobDescription } = useApp();
  const [tab, setTab] = useState<Tab>('paste');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parseError, setParseError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const hasContent = jobDescription.trim().length > 0;
  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;

  async function parseFile(file: File) {
    setParseError('');
    setIsParsing(true);
    setFileName(file.name);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/parse-cv', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setParseError(data.error ?? 'Could not read file. Please paste the job description instead.');
        setFileName('');
        return;
      }
      setJobDescription(data.text);
    } catch {
      setParseError('Network error — please try again or paste the text.');
      setFileName('');
    } finally {
      setIsParsing(false);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) { e.preventDefault(); setIsDragging(true); }
  function onDragLeave() { setIsDragging(false); }

  function clearJD() {
    setJobDescription('');
    setFileName('');
    setParseError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-full min-h-[460px] shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/25 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-text-primary">Job Description</h2>
            {fileName && (
              <p className="text-text-muted text-[11px] truncate max-w-[180px]" title={fileName}>{fileName}</p>
            )}
          </div>
        </div>
        {hasContent && (
          <button onClick={clearJD} className="text-xs text-text-muted hover:text-text-secondary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-bg-elevated">
            Clear
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle px-5 pt-3">
        {(['paste', 'upload'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-3 mr-5 text-sm font-medium transition-colors ${
              tab === t ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t === 'paste' ? 'Paste text' : 'Upload file'}
            {tab === t && (
              <motion.div layoutId="jd-tab-indicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-blue rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <AnimatePresence mode="wait">

          {/* Paste tab */}
          {tab === 'paste' && (
            <motion.div key="paste" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder={"Paste the full job description here…\n\nInclude everything: role summary, requirements, responsibilities,\nnice-to-haves, tech stack, company description.\n\nThe more detail you include, the more accurately\nyour CV will be tailored to match it."}
                className="w-full flex-1 min-h-[300px] resize-none bg-transparent text-text-primary placeholder-text-muted text-sm leading-relaxed outline-none"
                spellCheck={false}
              />
              {!hasContent && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-3 px-4 py-3 rounded-xl bg-bg-elevated border border-border-subtle">
                  <p className="text-text-muted text-xs leading-relaxed">
                    <span className="text-accent-blue font-medium">💡 Pro tip:</span>{' '}
                    Paste the entire job posting — including "nice to have" requirements and the company description. Every word helps the AI understand what the hiring manager is really looking for.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Upload tab */}
          {tab === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">

              {isParsing && (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[260px] gap-4">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full bg-accent-blue/10 animate-pulse" />
                    <svg className="w-14 h-14 -rotate-90 absolute inset-0" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <motion.circle cx="28" cy="28" r="22" fill="none" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" strokeDasharray="138.2" animate={{ strokeDashoffset: [138.2, 34.6, 138.2] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-semibold text-sm text-text-primary mb-1">Reading job description…</p>
                    <p className="text-text-muted text-xs">Extracting text from file</p>
                  </div>
                </div>
              )}

              {!isParsing && hasContent && fileName && (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[260px] gap-4">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 20 }} className="w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/25 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M8 9l2 2 4-4"/>
                    </svg>
                  </motion.div>
                  <div className="text-center">
                    <p className="font-display font-bold text-sm text-text-primary mb-1 max-w-[200px] truncate">{fileName}</p>
                    <p className="text-accent-blue text-xs mb-3">✓ {wordCount} words extracted</p>
                    <button onClick={() => fileRef.current?.click()} className="text-xs text-text-muted hover:text-text-secondary transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-border-strong">
                      Replace file
                    </button>
                  </div>
                </div>
              )}

              {!isParsing && !hasContent && (
                <div
                  onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                  onClick={() => fileRef.current?.click()}
                  className={`flex flex-col items-center justify-center flex-1 min-h-[260px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                    isDragging ? 'border-accent-blue bg-accent-blue/5 scale-[1.01]' : 'border-border hover:border-accent-blue/40 hover:bg-accent-blue/3'
                  }`}
                >
                  <div className="text-center px-6">
                    <motion.div animate={{ y: isDragging ? -4 : 0 }} className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </motion.div>
                    <p className="font-display font-semibold text-sm text-text-primary mb-1">
                      {isDragging ? 'Drop it here!' : 'Upload job description'}
                    </p>
                    <p className="text-text-muted text-xs mb-3">PDF or .txt file · or click to browse</p>
                    <div className="flex items-center justify-center gap-2">
                      {['PDF', 'TXT'].map(f => (
                        <span key={f} className="px-2.5 py-1 rounded-md bg-bg-elevated border border-border text-text-muted text-[10px] font-medium">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {parseError && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 px-3 py-2.5 rounded-xl bg-accent-red/8 border border-accent-red/20">
                  <p className="text-accent-red text-xs leading-relaxed">⚠ {parseError}</p>
                  <button onClick={() => { setParseError(''); setTab('paste'); }} className="text-accent-red/70 hover:text-accent-red text-xs underline mt-1">
                    Switch to paste mode →
                  </button>
                </motion.div>
              )}

              <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={onFileChange} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between">
        <span className={`text-xs ${hasContent ? 'text-accent-blue' : 'text-text-muted'}`}>
          {isParsing ? 'Parsing…' : hasContent ? `✓ ${wordCount} words detected` : 'No job description'}
        </span>
        {isParsing ? <Spinner /> : hasContent ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span className="text-xs text-accent-blue">Ready</span>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
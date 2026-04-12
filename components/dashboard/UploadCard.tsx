'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import { SAMPLE_CV } from '@/lib/ats-analyzer';

type Tab = 'paste' | 'upload';

export default function UploadCard() {
  const { cvText, setCvText, cvFileName, setCvFileName } = useApp();
  const [tab, setTab] = useState<Tab>('paste');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // ---------- File handling ----------
  function handleFile(file: File) {
    setUploadError('');
    if (file.type === 'application/pdf') {
      setCvFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        // For demo purposes, set a placeholder message for PDFs
        setCvText(`[PDF uploaded: ${file.name}]\n\n${SAMPLE_CV}`);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      setCvFileName(file.name);
      const reader = new FileReader();
      reader.onload = e => setCvText(e.target?.result as string || '');
      reader.readAsText(file);
    } else {
      setUploadError('Please upload a PDF or .txt file.');
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() { setIsDragging(false); }

  function loadSample() {
    setCvText(SAMPLE_CV);
    setCvFileName('');
    setTab('paste');
  }

  function clearCV() {
    setCvText('');
    setCvFileName('');
    setUploadError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const hasContent = cvText.trim().length > 0;

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-full min-h-[420px] shadow-card overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-green/10 border border-accent-green/25 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-text-primary">Your CV</h2>
            {cvFileName && (
              <p className="text-text-muted text-[11px] truncate max-w-[160px]">{cvFileName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sample CV button */}
          <button
            onClick={loadSample}
            className="text-xs text-accent-green hover:text-accent-green-light transition-colors px-3 py-1.5 rounded-lg hover:bg-accent-green/10 border border-accent-green/20 hover:border-accent-green/40"
          >
            Load sample
          </button>
          {hasContent && (
            <button
              onClick={clearCV}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-bg-elevated"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle px-5 pt-3">
        {(['paste', 'upload'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-3 mr-5 text-sm font-medium transition-colors capitalize ${
              tab === t ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t === 'paste' ? 'Paste text' : 'Upload file'}
            {tab === t && (
              <motion.div
                layoutId="cv-tab-indicator"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-green rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 p-4">
        <AnimatePresence mode="wait">
          {tab === 'paste' ? (
            <motion.div
              key="paste"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <textarea
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder="Paste your full CV / résumé text here…&#10;&#10;Include: work experience, skills, education, certifications, etc."
                className="w-full h-full min-h-[300px] resize-none bg-transparent text-text-primary placeholder-text-muted text-sm leading-relaxed outline-none"
                spellCheck={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {/* Drop zone */}
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileRef.current?.click()}
                className={`
                  flex flex-col items-center justify-center h-full min-h-[280px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                  ${isDragging
                    ? 'border-accent-green bg-accent-green/5 scale-[1.01]'
                    : hasContent
                      ? 'border-accent-green/40 bg-accent-green/5'
                      : 'border-border hover:border-accent-green/40 hover:bg-accent-green/3'
                  }
                `}
              >
                {hasContent && cvFileName ? (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/30 flex items-center justify-center mx-auto mb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M9 13l2 2 4-4" />
                      </svg>
                    </div>
                    <p className="font-medium text-text-primary text-sm">{cvFileName}</p>
                    <p className="text-text-muted text-xs mt-1">Click to replace</p>
                  </div>
                ) : (
                  <div className="text-center px-6">
                    <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="font-medium text-text-primary text-sm mb-1">
                      {isDragging ? 'Drop it here!' : 'Drop your CV here'}
                    </p>
                    <p className="text-text-muted text-xs">PDF or .txt · Click to browse</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-accent-red text-xs mt-2 text-center">{uploadError}</p>
              )}

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={onFileChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between">
        <span className={`text-xs ${hasContent ? 'text-accent-green' : 'text-text-muted'}`}>
          {hasContent
            ? `✓ ${cvText.trim().split(/\s+/).length} words`
            : 'No CV loaded'
          }
        </span>
        {hasContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            <span className="text-xs text-accent-green">Ready</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

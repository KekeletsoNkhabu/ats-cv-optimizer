'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing-section' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-bg-base/80 backdrop-blur-xl border-b border-border-subtle'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-accent-green rounded-lg opacity-20 group-hover:opacity-35 transition-opacity" />
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-accent-green/40 bg-accent-green/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-green">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <span className="font-display font-bold text-[1.05rem] tracking-tight">
              <span className="text-accent-green">ATS</span>
              <span className="text-text-primary"> Optimizer</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {isLanding && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLanding ? (
              <>
                <Link
                  href="/dashboard"
                  className="group relative overflow-hidden px-5 py-2.5 rounded-xl bg-accent-green text-bg-base text-sm font-semibold font-display transition-all duration-300 hover:shadow-glow-green-sm"
                >
                  <span className="relative z-10">Try Free →</span>
                  <motion.div
                    className="absolute inset-0 bg-white/15"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.45 }}
                  />
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-bg-elevated border border-border text-sm hover:border-border-strong transition-all duration-200"
              >
                ← Dashboard
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-bg-elevated transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
              <span className={`block h-0.5 bg-text-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-text-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-text-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden border-t border-border-subtle bg-bg-surface/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {isLanding && navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block mt-2 px-4 py-3 rounded-xl bg-accent-green text-bg-base font-semibold font-display text-center"
              >
                Try Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

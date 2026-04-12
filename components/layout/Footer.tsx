import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Resources: [
    { label: 'CV Templates', href: '#' },
    { label: 'ATS Guide', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Documentation', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-accent-green/40 bg-accent-green/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-green">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="font-display font-bold text-[1.05rem]">
                <span className="text-accent-green">ATS</span>
                <span className="text-text-primary"> Optimizer</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-[220px]">
              AI-powered CV optimization that helps you land more interviews.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display font-semibold text-sm text-text-secondary mb-4 tracking-wide uppercase text-xs">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border-subtle">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} ATS Optimizer. Built for job seekers everywhere.
          </p>
          <div className="flex items-center gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map(platform => (
              <Link
                key={platform}
                href="#"
                className="text-text-muted hover:text-text-primary text-sm transition-colors"
              >
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

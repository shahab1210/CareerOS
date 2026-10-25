import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Trending Tracks', href: '#tracks' },
    { name: 'Popular Categories', href: '#categories' },
    { name: 'Features Engine', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Student Stories', href: '#testimonials' },
    { name: 'AI Career Mentor', href: '/ai-mentor' },
  ];

  const tracksLinks = [
    { name: 'Full-Stack Distributed Systems', href: '/tracks' },
    { name: 'Cloud Native & DevOps Pipeline', href: '/tracks' },
    { name: 'Applied AI & LLM Engineering', href: '/tracks' },
    { name: 'Data Structures & Algorithms', href: '/coding' },
    { name: 'ATS Resume Scorer & Mock', href: '/mock-interview' },
  ];

  const resourceLinks = [
    { name: 'Study Room (RAG)', href: '/study-room' },
    { name: 'Student Community', href: '/community' },
    { name: 'Interview Question Bank', href: '/coding' },
    { name: 'Verified Portfolios', href: '/portfolio' },
    { name: 'Placement Statistics', href: '#testimonials' },
  ];

  const companyLinks = [
    { name: 'About CareerOS', href: '/' },
    { name: 'Student Testimonials', href: '#testimonials' },
    { name: 'careerOS.work@gmail.com', href: 'mailto:careerOS.work@gmail.com', isEmail: true },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-12 relative z-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-14 border-b border-white/15">
          
          {/* Brand & Mission (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-white font-heading inline-flex items-center gap-1 group"
            >
              <span>CareerOS</span>
              <span className="text-accent group-hover:scale-125 transition-transform duration-200">.</span>
            </Link>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm">
              The intelligent operating system for ambitious college students.
              From your first algorithmic challenge to landing your dream software engineering offer.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Career Engine Systems Operational</span>
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Product</h4>
            <ul className="space-y-2 text-xs">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-white/75 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tracks Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Tracks</h4>
            <ul className="space-y-2 text-xs">
              {tracksLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/75 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Resources</h4>
            <ul className="space-y-2 text-xs">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/75 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Company</h4>
            <ul className="space-y-2 text-xs">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-white/75 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all break-all"
                  >
                    {item.isEmail && <Mail className="w-3 h-3 text-secondary shrink-0" />}
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© {currentYear} CareerOS. Crafted for future builders and engineering leaders.</p>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X profile"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ArrowRight, Sparkles, BookOpen, Code2, Cloud, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  const navLinks = [
    { name: 'Tracks', href: '#tracks' },
    { name: 'Categories', href: '#categories' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Stories', href: '#testimonials' },
  ];

  const quickSearchItems = [
    { title: 'Full-Stack Distributed Systems', category: 'Track', icon: Code2, path: '/tracks' },
    { title: 'Cloud Native & DevOps Pipeline', category: 'Track', icon: Cloud, path: '/tracks' },
    { title: 'Applied AI & LLM Engineering', category: 'Track', icon: BrainCircuit, path: '/tracks' },
    { title: 'Algorithm & Data Structure Mastery', category: 'Practice', icon: Sparkles, path: '/coding' },
    { title: 'RAG Study Room & Notes', category: 'Tool', icon: BookOpen, path: '/study-room' },
  ];

  const filteredItems = quickSearchItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectQuickSearch = (path: string) => {
    setSearchModalOpen(false);
    navigate(path);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border/40 shadow-xs py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-foreground font-heading flex items-center gap-1 group"
          >
            <span>CareerOS</span>
            <span className="text-accent group-hover:scale-125 transition-transform duration-200">.</span>
          </Link>

          {/* Desktop Center Navigation Pills */}
          <nav className="hidden lg:flex items-center space-x-1 bg-surface/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 shadow-xs">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface/80 px-3.5 py-1.5 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Side: Search Trigger + Auth Pills */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/70 bg-surface/60 hover:bg-surface hover:border-accent/40 text-muted-foreground hover:text-foreground text-xs font-medium transition-all shadow-xs cursor-pointer"
              aria-label="Search tracks and roadmaps"
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Search tracks...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground/80 bg-surface-muted/60 border border-border px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Auth Actions */}
            <Button
              variant="ghost"
              className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-surface/80"
              asChild
            >
              <Link to="/login">Log In</Link>
            </Button>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-md shadow-accent/25 hover:shadow-lg transition-all active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu & Search Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-full text-foreground hover:bg-surface/80"
              aria-label="Open search dialog"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="p-2 rounded-full text-foreground hover:bg-surface/80"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden bg-background/98 backdrop-blur-xl border-b border-border shadow-xl px-6 py-5"
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-semibold tracking-wide text-foreground hover:text-accent py-2 transition-colors flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/60" />
                  </a>
                ))}

                <div className="pt-4 border-t border-border/70 flex flex-col space-y-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-full border border-border bg-surface text-foreground hover:bg-surface-muted transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-accent text-accent-foreground shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Quick Search Modal Dialog */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search tracks, career roadmaps, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                  aria-label="Close search dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                  Popular Quick Links
                </p>
                <div className="space-y-1">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => handleSelectQuickSearch(item.path)}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-muted/60 text-left transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </p>
                              <span className="text-[11px] text-muted-foreground">
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-accent transition-all" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No matching results found for "{searchQuery}".
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-surface-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Navigate quickly with keyboard</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

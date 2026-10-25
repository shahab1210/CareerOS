import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Play,
  LineChart,
  Cloud,
  Users,
  Briefcase,
  Sparkles,
  X,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import {
  HERO_WAVE_PATH,
  HERO_WAVE_DEPTH_PATH,
  heroContainerVariants,
  heroItemVariants,
  floatingCardStaggerVariants,
  floatingAccentVariants,
  cardFloatAnimation,
} from '@/components/layout/WaveDivider';

export function HeroSection() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const cards = [
    {
      title: 'FUN & EASY TO FOLLOW',
      desc: 'Master software engineering principles through structured, bite-sized roadmaps.',
      icon: LineChart,
      badgeColor: 'bg-primary/10 text-primary',
      floatOffsetY: 8,
      duration: 5.5,
      delay: 0,
    },
    {
      title: 'AVAILABLE ANYWHERE',
      desc: 'Instant cloud development environments synchronized seamlessly across all devices.',
      icon: Cloud,
      badgeColor: 'bg-secondary/20 text-primary',
      floatOffsetY: 10,
      duration: 6.2,
      delay: 0.4,
    },
    {
      title: 'HUMAN & AI REVIEWS',
      desc: 'Get automated semantic code evaluation combined with mentor-guided critiques.',
      icon: Users,
      badgeColor: 'bg-accent/10 text-accent',
      floatOffsetY: 9,
      duration: 5.8,
      delay: 0.8,
    },
    {
      title: 'REAL-WORK RESULTS',
      desc: 'Build production repositories and verified portfolios evaluated by top engineering leads.',
      icon: Briefcase,
      badgeColor: 'bg-primary/10 text-primary',
      floatOffsetY: 7,
      duration: 6.5,
      delay: 1.2,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32" id="hero">
        {/* Dynamic SVG Wave Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <svg
            viewBox="0 0 1440 680"
            preserveAspectRatio="none"
            className="w-full h-[620px] md:h-[680px] text-primary fill-current"
            aria-hidden="true"
          >
            <path
              d={HERO_WAVE_DEPTH_PATH}
              className="text-secondary/30 fill-current opacity-70"
            />
            <path d={HERO_WAVE_PATH} />
          </svg>

          {/* Ambient Floating Decorative Accent Spheres */}
          <motion.div
            variants={floatingAccentVariants.dot1}
            animate="animate"
            className="absolute left-[47%] top-[60%] w-5 h-5 rounded-full bg-white/90 shadow-lg shadow-white/30 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            variants={floatingAccentVariants.dot2}
            animate="animate"
            className="absolute left-[73%] top-[28%] w-3.5 h-3.5 rounded-full bg-secondary shadow-md shadow-secondary/40"
            aria-hidden="true"
          />
          <motion.div
            variants={floatingAccentVariants.dot3}
            animate="animate"
            className="absolute left-[31%] top-[74%] w-2.5 h-2.5 rounded-full bg-white/70"
            aria-hidden="true"
          />
          <motion.div
            variants={floatingAccentVariants.dot4}
            animate="animate"
            className="absolute right-[7%] top-[72%] w-2 h-2 rounded-full bg-accent/80"
            aria-hidden="true"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Eyebrow, H1, Subtitle, Dual Pill Buttons, Interactive Play Demo */}
            <motion.div
              className="lg:col-span-7 text-left"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Eyebrow Badge */}
              <motion.div variants={heroItemVariants} className="mb-4">
                <span className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-xs shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>The Intelligent Operating System for Students</span>
                </span>
              </motion.div>

              {/* H1 Headline */}
              <motion.h1
                variants={heroItemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-heading leading-[1.12] mb-6"
              >
                Accelerate Your <br />
                <span className="text-white/95">Career Online</span>
              </motion.h1>

              {/* Value Proposition Subtitle */}
              <motion.p
                variants={heroItemVariants}
                className="text-base sm:text-lg text-white/85 max-w-xl font-normal leading-relaxed mb-8"
              >
                From your first algorithmic challenge to landing a tier-one engineering offer.
                Master high-yield tech tracks, receive automated AI mentor reviews, and build
                proof-of-work repositories that recruiters respect.
              </motion.p>

              {/* Dual Pill CTA Buttons */}
              <motion.div
                variants={heroItemVariants}
                className="flex flex-wrap items-center gap-4 mb-10"
              >
                <Link
                  to="/tracks"
                  className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse Tracks</span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider shadow-xl shadow-accent/30 transition-all active:scale-95"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Interactive Play Demo Widget with Dual Concentric Pulsing Rings */}
              <motion.div variants={heroItemVariants} className="pt-2">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setDemoModalOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setDemoModalOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-4 cursor-pointer group focus:outline-hidden"
                  aria-label="Watch interactive platform demo"
                >
                  <div className="relative flex items-center justify-center w-14 h-14">
                    {/* Continuous Outer Pulse Ring 1 */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none"
                      animate={{
                        scale: [1, 1.45, 1.8],
                        opacity: [0.7, 0.25, 0],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                    {/* Continuous Outer Pulse Ring 2 (Phase shifted) */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30 pointer-events-none"
                      animate={{
                        scale: [1, 1.35, 1.65],
                        opacity: [0.6, 0.2, 0],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 1.2,
                      }}
                    />
                    {/* Inner Solid Interactive Button */}
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className="relative z-10 w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-xl group-hover:bg-accent group-hover:text-white transition-colors duration-300"
                    >
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </motion.div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-accent transition-colors">
                      Watch 2-Min Demo
                    </span>
                    <span className="text-[11px] text-white/70">
                      See how students reach 6-figure offers
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: 4 Staggered Masonry Floating Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start pt-6 lg:pt-0">
              {cards.map((card, idx) => {
                const IconComp = card.icon;
                const isOffset = idx % 2 === 1; // Stagger second column down

                return (
                  <motion.div
                    key={card.title}
                    custom={idx}
                    variants={floatingCardStaggerVariants}
                    initial="hidden"
                    animate="visible"
                    className={isOffset ? 'sm:translate-y-8' : ''}
                  >
                    <motion.div
                      {...cardFloatAnimation(card.floatOffsetY, card.duration, card.delay)}
                      className="bg-surface rounded-2xl p-6 border border-border/70 shadow-xl shadow-primary/10 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-full ${card.badgeColor} flex items-center justify-center mb-5 shadow-xs`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {card.desc}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Walkthrough / Demo Modal */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">CareerOS Walkthrough</h3>
                    <p className="text-xs text-muted-foreground">Interactive demo preview</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(false)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                  aria-label="Close demo modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="aspect-video rounded-2xl bg-primary/10 border border-border/80 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg mb-4 animate-pulse">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">Live Coding & AI Guidance</h4>
                  <p className="text-xs text-muted-foreground max-w-md mb-4">
                    Experience automated code verification, personalized roadmaps, and step-by-step milestone progression.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-[11px] bg-surface text-foreground font-semibold px-3 py-1 rounded-full border border-border">
                      LeetCode & GitHub Sync
                    </span>
                    <span className="text-[11px] bg-surface text-foreground font-semibold px-3 py-1 rounded-full border border-border">
                      RAG Document Study Room
                    </span>
                    <span className="text-[11px] bg-surface text-foreground font-semibold px-3 py-1 rounded-full border border-border">
                      AI Mock Interviewer
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/60">
                    <div className="flex items-center gap-1.5 text-accent text-xs font-bold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Step 1: Assess</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Analyze your current skillset & year.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/60">
                    <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Step 2: Build</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Ship verified, recruiter-ready projects.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/60">
                    <div className="flex items-center gap-1.5 text-accent text-xs font-bold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Step 3: Land Offer</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Ace technical and behavioral rounds.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-muted/40 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ready to accelerate your career?</span>
                <Link
                  to="/register"
                  onClick={() => setDemoModalOpen(false)}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all"
                >
                  <span>Start Free Today</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

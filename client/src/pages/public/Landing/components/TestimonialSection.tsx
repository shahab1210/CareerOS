import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { QuotationMarkSvg, TESTIMONIAL_WAVE_PATH, EASE_QUINT } from '@/components/layout/WaveDivider';

export function TestimonialSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="testimonials">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Quote Copy & Student Attribution */}
          <motion.div
            className="lg:col-span-7 text-left"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_QUINT }}
          >
            {/* Monumental Quotation Mark */}
            <QuotationMarkSvg className="w-14 h-14 text-accent mb-6 opacity-90" />

            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed italic mb-8 font-heading">
              "CareerOS gave me the structured roadmap I never received in university. The combination of automated code reviews, mentor milestones, and mock interviews helped me land my first-choice software engineer offer."
            </blockquote>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-foreground">Kelsey Smith</h4>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase text-accent bg-accent/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FRONT END PROGRAMMER / REACT APPS</span>
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Placed at Stripe • 2026 Graduate
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md shadow-primary/10 transition-all active:scale-95"
              >
                <span>Read More Success Stories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Student Portrait & Floating Achievement Plaque */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_QUINT }}
          >
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-4 border-surface shadow-2xl bg-surface-muted group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                alt="Kelsey Smith - CareerOS Graduate Placed at Stripe"
                loading="lazy"
                className="w-full h-[420px] object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />

              {/* Floating Achievement Plaque Overlaid at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface/95 backdrop-blur-md rounded-2xl p-4 border border-border/60 shadow-xl flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Verified Offer Accepted</p>
                  <p className="text-[11px] text-muted-foreground">Software Engineer • Stripe NYC</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Sweeping Bottom Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          className="w-full h-[100px] md:h-[130px] text-primary fill-current"
          aria-hidden="true"
        >
          <path d={TESTIMONIAL_WAVE_PATH} />
        </svg>
      </div>
    </section>
  );
}

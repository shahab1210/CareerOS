import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// =============================================================================
// 1. MATHEMATICAL CUBIC BÉZIER WAVE SVG PATHS (Continuous C1 & C2 Curvatures)
// =============================================================================

/**
 * Hero Wave SVG Path (ViewBox: 0 0 1440 680, preserveAspectRatio="none")
 * Covers top-left, cascades diagonally, scoops under floating cards.
 */
export const HERO_WAVE_PATH =
  'M 0,0 ' +
  'L 1440,0 ' +
  'L 1440,310 ' +
  'C 1380,260 1280,230 1180,260 ' +
  'C 1060,295 990,440 820,470 ' +
  'C 640,500 520,380 340,410 ' +
  'C 190,435 90,560 0,620 ' +
  'Z';

/**
 * Secondary subtle gradient depth underlayer (adds soft parallax and visual depth)
 */
export const HERO_WAVE_DEPTH_PATH =
  'M 0,0 ' +
  'L 1440,0 ' +
  'L 1440,260 ' +
  'C 1340,210 1220,190 1110,225 ' +
  'C 970,270 910,400 750,430 ' +
  'C 580,460 480,350 300,380 ' +
  'C 160,405 70,510 0,570 ' +
  'Z';

/**
 * Top-right organic bubble cutout matching the reference design layout
 */
export const HERO_TOP_RIGHT_CUTOUT_PATH =
  'M 1240,0 ' +
  'C 1240,75 1290,110 1370,100 ' +
  'C 1405,95 1428,80 1440,65 ' +
  'L 1440,0 ' +
  'Z';

/**
 * Section Transition Wave (Between Features & Trending Tracks, ViewBox: 0 0 1440 260)
 */
export const SECTION_TRANSITION_WAVE_PATH =
  'M 0,160 ' +
  'C 220,190 380,240 580,210 ' +
  'C 780,180 890,70 1080,50 ' +
  'C 1230,35 1360,100 1440,140 ' +
  'L 1440,260 ' +
  'L 0,260 ' +
  'Z';

/**
 * Inverted wave cap for seamless background transitions
 */
export const SECTION_TRANSITION_WAVE_INVERTED =
  'M 0,0 ' +
  'L 1440,0 ' +
  'L 1440,140 ' +
  'C 1360,100 1230,35 1080,50 ' +
  'C 890,70 780,180 580,210 ' +
  'C 380,240 220,190 0,160 ' +
  'Z';

/**
 * Testimonial Sweeping Wave Backdrop (ViewBox: 0 0 1440 320)
 */
export const TESTIMONIAL_WAVE_PATH =
  'M 0,180 ' +
  'C 320,120 540,220 820,190 ' +
  'C 1060,165 1240,70 1440,95 ' +
  'L 1440,320 ' +
  'L 0,320 ' +
  'Z';

// =============================================================================
// 2. MONUMENTAL DECORATIVE DOUBLE QUOTATION MARK SVG
// =============================================================================

export interface QuotationMarkSvgProps {
  className?: string;
}

export function QuotationMarkSvg({ className = 'w-16 h-16' }: QuotationMarkSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn('inline-block', className)}
      aria-hidden="true"
    >
      {/* Left Quote */}
      <path d="M12 36 C12 24 18 16 28 12 L30 18 C24 20 20 24 20 30 L28 30 C30.2 30 32 31.8 32 34 L32 46 C32 48.2 30.2 50 28 50 L16 50 C13.8 50 12 48.2 12 46 Z" />
      {/* Right Quote */}
      <path d="M38 36 C38 24 44 16 54 12 L56 18 C50 20 46 24 46 30 L54 30 C56.2 30 58 31.8 58 34 L58 46 C58 48.2 56.2 50 54 50 L42 50 C39.8 50 38 48.2 38 46 Z" />
    </svg>
  );
}

// =============================================================================
// 3. FRAMER MOTION PHYSICS & EASING CONSTANTS
// =============================================================================

export const EASE_QUINT = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export const SPRING_TACTILE = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 28,
  mass: 0.8,
};

export const SPRING_BOUNCE = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 0.6,
};

// Asynchronous harmonic oscillation variants for floating ambient accent dots
export const floatingAccentVariants: Record<string, Variants> = {
  dot1: {
    animate: {
      y: [0, -14, 0],
      x: [0, 6, 0],
      scale: [1, 1.08, 1],
      transition: {
        duration: 5.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  dot2: {
    animate: {
      y: [0, 12, 0],
      x: [0, -8, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 6.8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.6,
      },
    },
  },
  dot3: {
    animate: {
      y: [0, -10, 0],
      x: [0, -5, 0],
      transition: {
        duration: 4.8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1.2,
      },
    },
  },
  dot4: {
    animate: {
      y: [0, 8, 0],
      scale: [0.9, 1.15, 0.9],
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 4.2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.3,
      },
    },
  },
};

export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE_QUINT,
    },
  },
};

export const floatingCardStaggerVariants: Variants = {
  hidden: { opacity: 0, y: 45, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.35 + i * 0.14,
      duration: 0.9,
      ease: EASE_QUINT,
    },
  }),
};

export const cardFloatAnimation = (offsetY: number, duration: number, delay: number) => ({
  animate: {
    y: [0, -offsetY, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay,
    },
  },
  whileHover: {
    y: -8,
    scale: 1.025,
    boxShadow: '0 24px 38px -12px rgba(36, 72, 85, 0.16)',
    transition: SPRING_TACTILE,
  },
});

// =============================================================================
// 4. REUSABLE REACT SVG WAVE COMPONENTS
// =============================================================================

export interface HeroWaveProps {
  className?: string;
  showDepthLayer?: boolean;
}

export function HeroWave({ className = '', showDepthLayer = true }: HeroWaveProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden select-none', className)}>
      <svg
        viewBox="0 0 1440 680"
        preserveAspectRatio="none"
        className="w-full h-full text-primary fill-current"
        aria-hidden="true"
      >
        {showDepthLayer && (
          <path
            d={HERO_WAVE_DEPTH_PATH}
            className="text-secondary/25 fill-current opacity-60"
          />
        )}
        <path d={HERO_WAVE_PATH} />
      </svg>

      {/* Floating Ambient Accent Spheres */}
      <motion.div
        variants={floatingAccentVariants.dot1}
        animate="animate"
        className="absolute left-[47%] top-[62%] w-5 h-5 rounded-full bg-white/90 shadow-lg shadow-white/30 backdrop-blur-xs"
        aria-hidden="true"
      />
      <motion.div
        variants={floatingAccentVariants.dot2}
        animate="animate"
        className="absolute left-[73%] top-[30%] w-3.5 h-3.5 rounded-full bg-secondary shadow-md shadow-secondary/40"
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
  );
}

export interface TransitionWaveProps {
  inverted?: boolean;
  className?: string;
  fillClassName?: string;
}

export function SectionTransitionWave({
  inverted = false,
  className = '',
  fillClassName = 'text-background fill-current',
}: TransitionWaveProps) {
  return (
    <div className={cn('w-full overflow-hidden leading-none select-none pointer-events-none', className)}>
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className={cn('w-full h-[100px] md:h-[160px]', fillClassName)}
        aria-hidden="true"
      >
        <path d={inverted ? SECTION_TRANSITION_WAVE_INVERTED : SECTION_TRANSITION_WAVE_PATH} />
      </svg>
    </div>
  );
}

export interface TestimonialWaveProps {
  className?: string;
  fillClassName?: string;
}

export function TestimonialWave({
  className = '',
  fillClassName = 'text-primary fill-current',
}: TestimonialWaveProps) {
  return (
    <div className={cn('w-full overflow-hidden leading-none select-none pointer-events-none', className)}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className={cn('w-full h-[120px] md:h-[180px]', fillClassName)}
        aria-hidden="true"
      >
        <path d={TESTIMONIAL_WAVE_PATH} />
      </svg>
    </div>
  );
}

export interface WaveDividerProps {
  type?: 'hero' | 'transition' | 'transition-inverted' | 'testimonial';
  className?: string;
  fillClassName?: string;
}

export function WaveDivider({
  type = 'transition',
  className = '',
  fillClassName = 'text-primary fill-current',
}: WaveDividerProps) {
  switch (type) {
    case 'hero':
      return <HeroWave className={className} />;
    case 'transition':
      return <SectionTransitionWave className={className} fillClassName={fillClassName} />;
    case 'transition-inverted':
      return <SectionTransitionWave inverted className={className} fillClassName={fillClassName} />;
    case 'testimonial':
      return <TestimonialWave className={className} fillClassName={fillClassName} />;
    default:
      return null;
  }
}

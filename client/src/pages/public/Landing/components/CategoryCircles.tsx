import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Cloud, BrainCircuit, Palette, ShieldCheck, Briefcase } from 'lucide-react';
import { SPRING_TACTILE } from '@/components/layout/WaveDivider';

interface CategoryItem {
  name: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  path: string;
}

export function CategoryCircles() {
  const categories: CategoryItem[] = [
    {
      name: 'Code',
      count: '120 Tracks',
      icon: Code2,
      tag: 'Full-Stack & Systems',
      path: '/tracks?cat=engineering',
    },
    {
      name: 'Cloud',
      count: '45 Tracks',
      icon: Cloud,
      tag: 'DevOps & Infra',
      path: '/tracks?cat=cloud',
    },
    {
      name: 'AI & ML',
      count: '60 Tracks',
      icon: BrainCircuit,
      tag: 'LLMs & Agents',
      path: '/tracks?cat=ai',
    },
    {
      name: 'Design',
      count: '38 Tracks',
      icon: Palette,
      tag: 'UI/UX & Product',
      path: '/tracks?cat=design',
    },
    {
      name: 'Security',
      count: '24 Tracks',
      icon: ShieldCheck,
      tag: 'AppSec & ZeroTrust',
      path: '/tracks?cat=security',
    },
    {
      name: 'Interviews',
      count: '85 Tracks',
      icon: Briefcase,
      tag: 'Mock Prep & ATS',
      path: '/tracks?cat=interviews',
    },
  ];

  return (
    <section className="py-20 bg-surface/50 border-y border-border/40 relative overflow-hidden" id="categories">
      <div className="container mx-auto px-6 text-center">
        
        {/* Centered Eyebrow & Title */}
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            MOST POPULAR CATEGORIES
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
            Explore Accelerated Learning Domains
          </h2>
        </div>

        {/* 6 Circular Token Discs Row */}
        <div className="flex items-center justify-center flex-wrap gap-5 sm:gap-7 md:gap-9">
          {categories.map((cat, index) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  ...SPRING_TACTILE,
                }}
              >
                <Link to={cat.path} className="group focus:outline-hidden block">
                  <motion.div
                    whileHover={{ scale: 1.08, y: -6 }}
                    whileTap={{ scale: 0.94 }}
                    transition={SPRING_TACTILE}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary text-white flex flex-col items-center justify-center shadow-lg shadow-primary/15 group-hover:shadow-2xl group-hover:shadow-primary/30 border-2 border-white/10 group-hover:border-secondary transition-all duration-300 relative p-3 text-center cursor-pointer"
                  >
                    <IconComp className="w-6 h-6 sm:w-7 sm:h-7 mb-1 text-secondary group-hover:scale-110 group-hover:text-accent transition-all duration-300" />
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-white/70 uppercase tracking-wider mt-0.5 group-hover:text-white transition-colors">
                      {cat.count}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

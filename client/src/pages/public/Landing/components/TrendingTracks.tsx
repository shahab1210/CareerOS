import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Clock, ArrowUpRight, Star, Users } from 'lucide-react';
import { EASE_QUINT } from '@/components/layout/WaveDivider';

interface TrackItem {
  title: string;
  mentor: string;
  desc: string;
  tag: string;
  duration: string;
  rating: string;
  students: string;
  imgUrl: string;
}

export function TrendingTracks() {
  const tracks: TrackItem[] = [
    {
      title: 'Full-Stack Distributed Systems',
      mentor: 'Alex Rivera, ex-Staff Eng',
      desc: 'Master distributed microservices, event-driven architectures, and high-performance React frontends.',
      tag: 'Full-Stack',
      duration: '12 Weeks',
      rating: '4.95',
      students: '3,400+ enrolled',
      imgUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Cloud Native & DevOps Pipeline',
      mentor: 'Sarah Chen, Cloud Architect',
      desc: 'Master Kubernetes orchestration, Terraform infrastructure as code, and production CI/CD pipelines.',
      tag: 'DevOps',
      duration: '8 Weeks',
      rating: '4.92',
      students: '2,100+ enrolled',
      imgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Applied AI & LLM Engineering',
      mentor: 'Dr. Marcus Vance, AI Lab Lead',
      desc: 'Build vector embeddings, production RAG pipelines, autonomous multi-agent systems, and model evals.',
      tag: 'AI & ML',
      duration: '10 Weeks',
      rating: '4.98',
      students: '5,800+ enrolled',
      imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-24 bg-background relative" id="tracks">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_QUINT }}
          className="mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPLORE SOMETHING NEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground tracking-tight">
            Trending Tutorials & Career Tracks
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Curated, project-backed syllabi designed by tech leads to take you from foundational syntax to staff-level design.
          </p>
        </motion.div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: index * 0.15, ease: EASE_QUINT }}
              className="bg-surface rounded-2xl overflow-hidden border border-border/70 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              {/* Media Aspect Ratio Container */}
              <div className="relative aspect-video overflow-hidden bg-surface-muted">
                <img
                  src={track.imgUrl}
                  alt={track.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md text-foreground text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                  {track.tag}
                </span>
                <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md text-foreground text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span>{track.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-heading text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {track.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <GraduationCap className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{track.mentor}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {track.desc}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/80" />
                      {track.duration}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1 font-medium hidden sm:inline-flex">
                      <Users className="w-3.5 h-3.5 text-muted-foreground/80" />
                      {track.students}
                    </span>
                  </div>

                  <Link
                    to="/tracks"
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-xs transition-all active:scale-95 group-hover:translate-x-0.5"
                  >
                    <span>Start Track</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { HeroSection } from './components/HeroSection';
import { CategoryCircles } from './components/CategoryCircles';
import { TrendingTracks } from './components/TrendingTracks';
import { FeaturesSection } from './components/FeaturesSection';
import { RoadmapSection } from './components/RoadmapSection';
import { TestimonialSection } from './components/TestimonialSection';
import { Footer } from './components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <PageContainer>
        <HeroSection />
        <CategoryCircles />
        <TrendingTracks />
        <FeaturesSection />
        <RoadmapSection />
        <TestimonialSection />
      </PageContainer>
      <Footer />
    </div>
  );
}

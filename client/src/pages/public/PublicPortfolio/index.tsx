import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle2, Code2, ExternalLink, Star, 
  MapPin, GraduationCap, Award, Briefcase, Share2, Loader2, Sparkles 
} from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const GithubIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const res = await api.get(`/profile/public/${username}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error('Failed to fetch public profile', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchPublicPortfolio();
    }
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Portfolio link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Verifying and loading candidate portfolio...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Candidate Portfolio Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-sm mb-6">
          The requested profile URL is invalid or the candidate has not made their profile public.
        </p>
        <Button asChild variant="accent">
          <Link to="/">Back to CareerOS</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Banner */}
      <div className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary font-heading">
            CareerOS<span className="text-accent">.</span>
            <span className="text-xs font-normal text-muted-foreground ml-2">Verified Recruiter View</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 text-xs">
            <Share2 size={14} /> Share Profile
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-8">
        {/* Hero Card */}
        <Card className="border-accent/20 bg-surface/80 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-36 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-3xl font-bold text-accent font-heading">
                  {profile.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold font-heading text-foreground">{profile.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Verified Candidate
                    </span>
                  </div>
                  <p className="text-base text-muted-foreground mt-1">{profile.headline}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={14} /> {profile.branch} • {profile.college}
                    </span>
                    {profile.cgpa && (
                      <span className="font-semibold text-accent">
                        CGPA: {profile.cgpa.toFixed(2)}
                      </span>
                    )}
                    {profile.graduationYear && (
                      <span>Class of {profile.graduationYear}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Career Readiness Score Badge */}
              <div className="p-5 rounded-2xl bg-surface-muted border border-border text-center min-w-[170px]">
                <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">
                  Readiness Score
                </div>
                <div className="text-4xl font-black font-heading text-accent">
                  {profile.crsScore}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">out of 1000 (Top 10%)</div>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
                {profile.bio}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skills & Coding Ratings */}
          <div className="space-y-6 lg:col-span-1">
            {/* Coding Profiles Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent" /> Verified Problem Solving
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.codingProfiles && profile.codingProfiles.length > 0 ? (
                  profile.codingProfiles.map((cp: any) => (
                    <div key={cp.id} className="p-3 bg-surface-muted rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-foreground">{cp.platform}</div>
                        <div className="text-[11px] text-muted-foreground">@{cp.username}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-accent">{cp.solved} Solved</div>
                        {cp.rating > 0 && (
                          <div className="text-[10px] text-muted-foreground">Rating: {cp.rating}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No coding profiles linked yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Skills Matrix */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" /> Verified Competencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || []).map((skill: any, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs bg-surface-muted border border-border flex items-center justify-between gap-3"
                    >
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-[10px] font-bold text-accent">Lvl {skill.level}/10</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Projects & GitHub Repositories */}
          <div className="space-y-6 lg:col-span-2">
            {/* Projects Showcase */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-accent" /> Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((proj: any) => (
                    <div key={proj.id} className="p-4 rounded-xl border border-border bg-surface-muted/30 hover:border-accent/30 transition-all">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-foreground text-sm">{proj.title}</h4>
                        <div className="flex items-center gap-2">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                              <GithubIcon size={16} />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.tech && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {proj.tech.map((t: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-surface text-muted-foreground border border-border">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No projects featured yet.</p>
                )}
              </CardContent>
            </Card>

            {/* GitHub Public Proof-of-Work */}
            {profile.github && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GithubIcon className="w-4 h-4 text-accent" /> GitHub Activity & Repositories
                    </CardTitle>
                    <a
                      href={`https://github.com/${profile.github.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      @{profile.github.username} <ExternalLink size={12} />
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface-muted rounded-xl text-center">
                      <div className="text-xl font-bold text-foreground">{profile.github.publicRepos}</div>
                      <div className="text-[11px] text-muted-foreground">Public Repositories</div>
                    </div>
                    <div className="p-3 bg-surface-muted rounded-xl text-center">
                      <div className="text-xl font-bold text-accent">⭐ {profile.github.totalStars}</div>
                      <div className="text-[11px] text-muted-foreground">Total Stars Earned</div>
                    </div>
                  </div>

                  {profile.github.topRepos && profile.github.topRepos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {profile.github.topRepos.map((repo: any) => (
                        <a
                          key={repo.id}
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 rounded-lg border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="font-semibold text-xs text-foreground truncate">{repo.name}</div>
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                              {repo.description || 'Public open source repository.'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border/50">
                            <span>{repo.primaryLanguage || 'Code'}</span>
                            <span>⭐ {repo.stars}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

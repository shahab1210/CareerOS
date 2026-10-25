import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Trophy, Users, MessageSquare, Sparkles, Send, 
  ExternalLink, Code2, Star, CheckCircle2, UserPlus, Search, Filter, Loader2 
} from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'team-matches' | 'feed'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [teamMatches, setTeamMatches] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // Filters
  const [branchFilter, setBranchFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchTabData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'leaderboard') {
        const res = await api.get('/community/leaderboard');
        setLeaderboard(res.data.data || []);
      } else if (activeTab === 'team-matches') {
        const res = await api.get('/community/team-matches');
        setTeamMatches(res.data.data || []);
      } else if (activeTab === 'feed') {
        const res = await api.get('/community/feed');
        setFeed(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching community data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsPosting(true);
    try {
      const res = await api.post('/community/posts', { content: newPost });
      setFeed(prev => [res.data.data, ...prev]);
      setNewPost('');
      toast.success('Post shared with campus!');
    } catch (err) {
      toast.error('Failed to publish post.');
    } finally {
      setIsPosting(false);
    }
  };

  const handlePitchTeammate = (name: string) => {
    toast.success(`Collaboration pitch sent to ${name}!`);
  };

  const filteredLeaderboard = leaderboard.filter(item => {
    const matchesBranch = !branchFilter || item.branch.toLowerCase().includes(branchFilter.toLowerCase());
    const matchesSearch = !searchQuery || `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Campus & Peer Hub</h1>
          <p className="text-muted-foreground mt-1">
            Compete on campus leaderboards, find complementary hackathon teammates, and connect with peers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-surface-muted rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy size={16} /> Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('team-matches')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'team-matches'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users size={16} /> Team Matchmaker
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'feed'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare size={16} /> Campus Feed
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Loading campus community data...</p>
        </div>
      ) : activeTab === 'leaderboard' ? (
        /* TAB 1: CAMPUS LEADERBOARD */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-xl border border-border">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="AI / ML">AI / ML</option>
              </select>
            </div>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Branch & College</th>
                    <th className="py-3.5 px-4 text-center">DSA Solved</th>
                    <th className="py-3.5 px-4 text-center">Max Rating</th>
                    <th className="py-3.5 px-4 text-center">GitHub Stars</th>
                    <th className="py-3.5 px-4 text-right">Career Readiness (CRS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No students found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeaderboard.map((student) => (
                      <tr key={student.id} className="hover:bg-surface-muted/30 transition-colors">
                        <td className="py-4 px-4 font-bold">
                          {student.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-500 font-bold">
                              🥇 1
                            </span>
                          ) : student.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-300 font-bold">
                              🥈 2
                            </span>
                          ) : student.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 font-bold">
                              🥉 3
                            </span>
                          ) : (
                            <span className="text-muted-foreground pl-2">{student.rank}</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-foreground">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">{student.headline}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-foreground">{student.branch}</div>
                          <div className="text-xs text-muted-foreground">{student.college}</div>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-foreground">
                          {student.totalSolved}
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-accent">
                          {student.maxRating > 0 ? student.maxRating : '—'}
                        </td>
                        <td className="py-4 px-4 text-center text-muted-foreground">
                          ⭐ {student.githubStars}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent">
                            {student.crsScore} / 1000
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : activeTab === 'team-matches' ? (
        /* TAB 2: TEAM FORMATION MATCHMAKER */
        <div className="space-y-6">
          <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Complementary Skill Matching</h4>
                <p className="text-xs text-muted-foreground">
                  Our algorithm prioritizes peers whose strengths balance your skill gaps (e.g. Frontend + Backend/ML).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMatches.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No matching team recommendations found. Check back once more peers join!
              </div>
            ) : (
              teamMatches.map((peer) => (
                <Card key={peer.id} className="flex flex-col justify-between hover:border-accent/40 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">
                          {peer.firstName} {peer.lastName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{peer.branch} • {peer.college}</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">
                        {peer.matchScore}% Match
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">{peer.headline}</p>
                      
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-foreground block">Complementary Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {peer.skills.map((skill: any, idx: number) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-muted text-foreground border border-border"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {peer.projectsCount} Projects built
                      </span>
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => handlePitchTeammate(peer.firstName)}
                        className="gap-1.5 text-xs"
                      >
                        <UserPlus size={14} /> Pitch for Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* TAB 3: CAMPUS FEED */
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Post Composer */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share a project milestone, ask for hackathon teammates, or ask a question..."
                  className="w-full min-h-[90px] p-3 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="accent"
                    disabled={isPosting || !newPost.trim()}
                    className="gap-2 text-xs"
                  >
                    {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={14} />}
                    Post to Campus
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Posts Timeline */}
          <div className="space-y-4">
            {feed.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No posts yet. Be the first to share an update with your campus!
              </div>
            ) : (
              feed.map((post) => (
                <Card key={post.id} className="space-y-3">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {post.profile ? `${post.profile.firstName} ${post.profile.lastName}` : 'Campus Student'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.profile?.college || 'Engineering Campus'}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                      {post.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

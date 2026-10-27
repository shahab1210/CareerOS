import { communityRepo } from '../repositories/community.repository';
import { AppError } from '@/common/errors/AppError';
import { ErrorCodes } from '@/common/errors/ErrorCodes';
import { prisma } from '@/config/database';

export class CommunityService {
  
  /**
   * Smart Peer Matchmaking:
   * Finds users in the same college, branch, or who share the same career goals.
   */
  async getPeerRecommendations(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { careerGoals: true }
    });
    
    if (!profile) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');

    const goalIds = profile.careerGoals.map(g => g.id);

    // Find profiles that match college, branch, OR have similar goals
    const peers = await prisma.studentProfile.findMany({
      where: {
        id: { not: profile.id },
        OR: [
          { college: profile.college },
          { branch: profile.branch },
          { careerGoals: { some: { id: { in: goalIds } } } }
        ]
      },
      include: { careerGoals: true },
      take: 20
    });

    // Score them to sort highest matches first
    const scoredPeers = peers.map(peer => {
      let score = 0;
      if (peer.college === profile.college) score += 30;
      if (peer.branch === profile.branch) score += 20;
      
      const sharedGoals = peer.careerGoals.filter(g => goalIds.includes(g.id)).length;
      score += (sharedGoals * 25);
      
      return {
        id: peer.id,
        firstName: peer.firstName,
        lastName: peer.lastName,
        college: peer.college,
        branch: peer.branch,
        matchScore: Math.min(100, score)
      };
    });

    return scoredPeers.sort((a, b) => b.matchScore - a.matchScore);
  }

  async sendConnectionRequest(userId: string, recipientId: string) {
    const requester = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!requester) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');

    if (requester.id === recipientId) {
      throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Cannot connect with yourself');
    }

    const existing = await prisma.connection.findUnique({
      where: { requesterId_recipientId: { requesterId: requester.id, recipientId } }
    });

    if (existing) throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Connection already exists');

    return communityRepo.sendConnectionRequest(requester.id, recipientId);
  }

  async updateConnectionStatus(userId: string, connectionId: string, status: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');

    const conn = await prisma.connection.findUnique({ where: { id: connectionId } });
    if (!conn) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Connection not found');
    
    if (conn.recipientId !== profile.id) {
      throw new AppError(403, ErrorCodes.FORBIDDEN, 'Only the recipient can accept/reject');
    }

    return communityRepo.updateConnectionStatus(connectionId, status);
  }

  async getMyNetwork(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');

    return communityRepo.getAcceptedConnections(profile.id);
  }

  async createPost(userId: string, content: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');

    return communityRepo.createPost(profile.id, content);
  }

  async getFeed() {
    return communityRepo.getFeed();
  }

  /**
   * Campus Leaderboard:
   * Ranks students based on the composite Career Readiness Score (CRS 0-1000).
   */
  async getLeaderboard(params: { college?: string; branch?: string; limit?: number }) {
    const whereClause: any = {};
    if (params.college) whereClause.college = params.college;
    if (params.branch) whereClause.branch = params.branch;

    const profiles = await prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        codingProfiles: true,
        githubProfile: true,
        userSkills: { include: { skill: true } },
        roadmaps: true,
        projects: true,
      },
      take: params.limit || 50,
    });

    const ranked = profiles.map(p => {
      let crs = 0;
      // Coding (max 300)
      const totalSolved = p.codingProfiles.reduce((acc, cp) => acc + (cp.solved || 0), 0);
      const maxRating = Math.max(0, ...p.codingProfiles.map(cp => cp.rating || 0));
      crs += Math.min(200, Math.round(totalSolved * 1.5));
      crs += Math.min(100, Math.round(maxRating * 0.08));

      // GitHub (max 250)
      if (p.githubProfile) {
        crs += Math.min(150, (p.githubProfile.publicRepos * 10) + (p.githubProfile.totalStars * 25));
        crs += Math.min(100, p.githubProfile.followers * 5);
      }

      // Skills (max 250)
      const skillsScore = p.userSkills.reduce((acc, us) => acc + (us.currentLevel * 10), 0);
      crs += Math.min(250, skillsScore);

      // Projects & Roadmaps (max 200)
      const avgRoadmap = p.roadmaps.length > 0 
        ? (p.roadmaps.reduce((acc, r) => acc + r.completion, 0) / p.roadmaps.length) 
        : 0;
      crs += Math.min(100, Math.round(avgRoadmap));
      crs += Math.min(100, p.projects.length * 35);

      crs = Math.min(1000, Math.max(80, crs));

      return {
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        college: p.college || 'Engineering Campus',
        branch: p.branch || 'Computer Science',
        avatarUrl: p.avatarUrl,
        headline: p.headline || 'Aspiring Software Engineer',
        crsScore: crs,
        totalSolved,
        maxRating,
        githubStars: p.githubProfile?.totalStars || 0,
        projectsCount: p.projects.length,
        topSkills: p.userSkills.slice(0, 3).map(us => us.skill.name),
      };
    });

    // Sort descending by CRS Score
    ranked.sort((a, b) => b.crsScore - a.crsScore);

    return ranked.map((r, index) => ({
      rank: index + 1,
      ...r,
    }));
  }

  /**
   * Hackathon & Capstone Team Matchmaker:
   * Recommends peers with complementary skills to build balanced teams.
   */
  async getTeamMatchRecommendations(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        userSkills: { include: { skill: true } },
      }
    });

    if (!profile) throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');

    const myCategories = new Set(profile.userSkills.map(us => us.skill.category));
    const mySkillNames = new Set(profile.userSkills.map(us => us.skill.name.toLowerCase()));

    const candidates = await prisma.studentProfile.findMany({
      where: {
        id: { not: profile.id },
      },
      include: {
        userSkills: { include: { skill: true } },
        projects: true,
        codingProfiles: true,
      },
      take: 25,
    });

    const matches = candidates.map(candidate => {
      let complementaryPoints = 0;
      const candidateSkills = candidate.userSkills.map(us => us.skill);

      for (const cs of candidateSkills) {
        // High reward for skills in different categories (e.g., frontend vs ML/backend)
        if (!myCategories.has(cs.category)) {
          complementaryPoints += 30;
        } else if (!mySkillNames.has(cs.name.toLowerCase())) {
          complementaryPoints += 15;
        }
      }

      if (candidate.college === profile.college) complementaryPoints += 20;

      const matchScore = Math.min(100, Math.max(30, complementaryPoints));

      return {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        college: candidate.college || 'Engineering Campus',
        branch: candidate.branch || 'Computer Science',
        avatarUrl: candidate.avatarUrl,
        headline: candidate.headline || 'Student Developer',
        matchScore,
        skills: candidateSkills.slice(0, 4).map(s => ({ name: s.name, category: s.category })),
        projectsCount: candidate.projects.length,
      };
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const communityService = new CommunityService();

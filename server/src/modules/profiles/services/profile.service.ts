import { profileRepository } from '../repositories/profile.repository';
import { AppError } from '@/common/errors/AppError';
import { ErrorCodes } from '@/common/errors/ErrorCodes';

import { prisma } from '@/config/database';

export class ProfileService {
  
  async getProfile(userId: string) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Profile not found');
    }

    const completionPercentage = this.calculateCompletionPercentage(profile);

    return {
      ...profile,
      completionPercentage,
    };
  }

  async updateProfile(userId: string, data: any) {
    // Ensure profile exists
    await this.getProfile(userId);
    return profileRepository.updateProfile(userId, data);
  }

  async addEducation(userId: string, data: any) {
    const profile = await this.getProfile(userId);
    return profileRepository.addEducation(profile.id, data);
  }

  async updateCareerGoals(userId: string, goals: any[]) {
    const profile = await this.getProfile(userId);
    await profileRepository.replaceCareerGoals(profile.id, goals);
    return this.getProfile(userId);
  }

  async updateCareerInterests(userId: string, interests: any[]) {
    const profile = await this.getProfile(userId);
    await profileRepository.replaceCareerInterests(profile.id, interests);
    return this.getProfile(userId);
  }

  /**
   * Public Verified Student Portfolio
   * Accessible without authentication (recruiter link).
   */
  async getPublicProfile(usernameOrId: string) {
    const profile = await prisma.studentProfile.findFirst({
      where: {
        OR: [
          { id: usernameOrId },
          { userId: usernameOrId },
          { githubProfile: { username: usernameOrId } }
        ]
      },
      include: {
        education: true,
        careerGoals: true,
        userSkills: { include: { skill: true } },
        projects: true,
        codingProfiles: true,
        githubProfile: { include: { repositories: { take: 6, orderBy: { stars: 'desc' } } } },
      }
    });

    if (!profile) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Student portfolio not found');
    }

    // Calculate CRS Score
    const totalSolved = profile.codingProfiles.reduce((acc, cp) => acc + cp.solved, 0);
    const maxRating = Math.max(0, ...profile.codingProfiles.map(cp => cp.rating));
    const codingScore = Math.min(300, Math.round(totalSolved * 1.5 + maxRating * 0.08));
    const githubScore = profile.githubProfile ? Math.min(250, profile.githubProfile.publicRepos * 10 + profile.githubProfile.totalStars * 25) : 0;
    const skillsScore = Math.min(250, profile.userSkills.reduce((acc, us) => acc + us.currentLevel * 10, 0));
    const projectScore = Math.min(200, profile.projects.length * 40);

    const crsScore = Math.min(1000, Math.max(100, codingScore + githubScore + skillsScore + projectScore));

    return {
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName}`,
      college: profile.college || 'Engineering College',
      branch: profile.branch || 'Computer Science',
      graduationYear: profile.graduationYear,
      cgpa: profile.cgpa,
      avatarUrl: profile.avatarUrl,
      headline: profile.headline || 'Software Engineer in Training',
      bio: profile.bio || 'Passionate student engineer building impactful software products.',
      crsScore,
      education: profile.education,
      skills: profile.userSkills.map(us => ({
        name: us.skill.name,
        category: us.skill.category,
        level: us.currentLevel,
      })),
      projects: profile.projects,
      codingProfiles: profile.codingProfiles,
      github: profile.githubProfile ? {
        username: profile.githubProfile.username,
        publicRepos: profile.githubProfile.publicRepos,
        totalStars: profile.githubProfile.totalStars,
        topRepos: profile.githubProfile.repositories,
      } : null,
    };
  }

  /**
   * Training & Placement Officer (TPO) Campus Analytics
   */
  async getTpoStats(collegeFilter?: string) {
    const where: any = collegeFilter ? { college: collegeFilter } : {};

    const totalStudents = await prisma.studentProfile.count({ where });
    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        applications: true,
        userSkills: { include: { skill: true } },
      }
    });

    let placedStudents = 0;
    let totalCgpa = 0;
    let cgpaCount = 0;
    const branchMap: Record<string, number> = {};
    const skillCounts: Record<string, number> = {};

    for (const s of students) {
      if (s.branch) {
        branchMap[s.branch] = (branchMap[s.branch] || 0) + 1;
      }
      if (s.cgpa) {
        totalCgpa += s.cgpa;
        cgpaCount++;
      }
      const hasOffer = s.applications.some(a => a.status === 'OFFER');
      if (hasOffer) placedStudents++;

      for (const us of s.userSkills) {
        skillCounts[us.skill.name] = (skillCounts[us.skill.name] || 0) + 1;
      }
    }

    const averageCgpa = cgpaCount > 0 ? parseFloat((totalCgpa / cgpaCount).toFixed(2)) : 7.8;
    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalStudents,
      placedStudents,
      unplacedStudents: Math.max(0, totalStudents - placedStudents),
      placementRate,
      averageCgpa,
      branchDistribution: branchMap,
      topSkills,
    };
  }

  /**
   * TPO Student Filterable Directory
   */
  async getTpoStudents(params: { minCgpa?: number; branch?: string; placed?: boolean }) {
    const whereClause: any = {};
    if (params.branch) whereClause.branch = params.branch;
    if (params.minCgpa) whereClause.cgpa = { gte: params.minCgpa };

    const students = await prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        user: { select: { email: true } },
        applications: true,
        codingProfiles: true,
        projects: true,
        userSkills: { include: { skill: true } },
      },
      take: 50,
    });

    const mapped = students.map(s => {
      const isPlaced = s.applications.some(a => a.status === 'OFFER');
      const totalSolved = s.codingProfiles.reduce((acc, cp) => acc + cp.solved, 0);

      return {
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.user?.email || 'student@campus.edu',
        college: s.college || 'Engineering College',
        branch: s.branch || 'Computer Science',
        cgpa: s.cgpa || 7.5,
        graduationYear: s.graduationYear || 2026,
        isPlaced,
        totalSolved,
        projectsCount: s.projects.length,
        skills: s.userSkills.slice(0, 4).map(us => us.skill.name),
      };
    });

    if (params.placed !== undefined) {
      return mapped.filter(m => m.isPlaced === params.placed);
    }

    return mapped;
  }

  private calculateCompletionPercentage(profile: any): number {
    const fieldsToTrack = [
      'college',
      'branch',
      'graduationYear',
      'currentYear',
      'location',
    ];
    
    let filled = 0;
    const total = fieldsToTrack.length + 3;

    fieldsToTrack.forEach(field => {
      if (profile[field] !== null && profile[field] !== undefined && profile[field] !== '') {
        filled++;
      }
    });

    if (profile.education && profile.education.length > 0) filled++;
    if (profile.careerGoals && profile.careerGoals.length > 0) filled++;
    if (profile.careerInterests && profile.careerInterests.length > 0) filled++;

    return Math.round((filled / total) * 100);
  }
}

export const profileService = new ProfileService();

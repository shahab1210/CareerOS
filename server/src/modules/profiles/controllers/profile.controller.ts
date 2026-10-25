import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { successResponse } from '@/common/utils/response';
import { AppError } from '@/common/errors/AppError';
import { ErrorCodes } from '@/common/errors/ErrorCodes';

export class ProfileController {
  
  getProfile = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await profileService.getProfile(userId);
    res.json(successResponse(profile));
  };

  updateProfile = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const updated = await profileService.updateProfile(userId, req.body);
    res.json(successResponse(updated, 'Profile updated successfully'));
  };

  uploadAvatar = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    if (!req.file) {
      throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Please upload a file');
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updated = await profileService.updateProfile(userId, { avatarUrl });
    res.json(successResponse(updated, 'Profile picture uploaded successfully'));
  };

  uploadResume = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    if (!req.file) {
      throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Please upload a file');
    }
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const updated = await profileService.updateProfile(userId, { resumeUrl });
    res.json(successResponse(updated, 'Resume uploaded successfully'));
  };

  addEducation = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const education = await profileService.addEducation(userId, req.body);
    res.status(201).json(successResponse(education, 'Education added successfully'));
  };

  updateCareerGoals = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await profileService.updateCareerGoals(userId, req.body.goals);
    res.json(successResponse(profile, 'Career goals updated successfully'));
  };

  updateCareerInterests = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await profileService.updateCareerInterests(userId, req.body.interests);
    res.json(successResponse(profile, 'Career interests updated successfully'));
  };

  getPublicProfile = async (req: Request, res: Response) => {
    const username = req.params.username as string;
    const portfolio = await profileService.getPublicProfile(username);
    res.json(successResponse(portfolio, 'Public portfolio fetched successfully'));
  };

  getTpoStats = async (req: Request, res: Response) => {
    const college = req.query.college as string | undefined;
    const stats = await profileService.getTpoStats(college);
    res.json(successResponse(stats, 'TPO placement statistics fetched'));
  };

  getTpoStudents = async (req: Request, res: Response) => {
    const branch = req.query.branch as string | undefined;
    const minCgpa = req.query.minCgpa ? parseFloat(req.query.minCgpa as string) : undefined;
    const placed = req.query.placed !== undefined ? req.query.placed === 'true' : undefined;

    const students = await profileService.getTpoStudents({ branch, minCgpa, placed });
    res.json(successResponse(students, 'TPO students directory fetched'));
  };
}

export const profileController = new ProfileController();


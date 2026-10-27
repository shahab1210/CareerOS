import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import GlobalError from '@/components/errors/GlobalError';

// Lazy loading pages for code splitting
const LandingPage = React.lazy(() => import('@/pages/public/Landing'));
const LoginPage = React.lazy(() => import('@/pages/auth/Login'));
const RegisterPage = React.lazy(() => import('@/pages/auth/Register'));
const OnboardingPage = React.lazy(() => import('@/pages/auth/Onboarding'));
const NotFoundPage = React.lazy(() => import('@/pages/public/NotFound'));
const Dashboard = React.lazy(() => import('@/pages/app/Dashboard'));
const RoadmapPage = React.lazy(() => import('@/pages/app/Roadmap'));
const CodingProfilesPage = React.lazy(() => import('@/pages/app/Coding'));
const ProjectsPage = React.lazy(() => import('@/pages/app/Projects'));
const StudyRoomPage = React.lazy(() => import('@/pages/app/StudyRoom'));
const JobsPage = React.lazy(() => import('@/pages/app/Jobs'));
const AIMentorPage = React.lazy(() => import('@/pages/app/AIMentor'));
const ProfilePage = React.lazy(() => import('@/pages/app/Profile'));
const SettingsPage = React.lazy(() => import('@/pages/app/Settings'));
const MockInterviewPage = React.lazy(() => import('@/pages/app/MockInterview'));
const CommunityPage = React.lazy(() => import('@/pages/app/Community'));
const TPOPage = React.lazy(() => import('@/pages/app/TPO'));
const PublicPortfolioPage = React.lazy(() => import('@/pages/public/PublicPortfolio'));

// Suspense fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

// HOC to wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
      {
        path: 'onboarding',
        element: withSuspense(OnboardingPage),
      },

      {
        path: 'app',
        element: <DashboardLayout />,
        errorElement: <GlobalError />,
        children: [
          {
            path: 'dashboard',
            element: withSuspense(Dashboard),
          },
          {
            path: 'roadmap',
            element: withSuspense(RoadmapPage),
          },
          {
            path: 'coding',
            element: withSuspense(CodingProfilesPage),
          },
          {
            path: 'projects',
            element: withSuspense(ProjectsPage),
          },
          {
            path: 'study-room',
            element: withSuspense(StudyRoomPage),
          },
          {
            path: 'jobs',
            element: withSuspense(JobsPage),
          },
          {
            path: 'ai-mentor',
            element: withSuspense(AIMentorPage),
          },
          {
            path: 'profile',
            element: withSuspense(ProfilePage),
          },
          {
            path: 'settings',
            element: withSuspense(SettingsPage),
          },
          {
            path: 'mock-interview',
            element: withSuspense(MockInterviewPage),
          },
          {
            path: 'community',
            element: withSuspense(CommunityPage),
          },
          {
            path: 'tpo',
            element: withSuspense(TPOPage),
          },
        ]
      },
      {
        path: 'p/:username',
        element: withSuspense(PublicPortfolioPage),
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);

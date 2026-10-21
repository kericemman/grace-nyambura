import { createBrowserRouter, redirect } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../pages/admin/AdminLayout';
import { ContentEditorPage } from '../pages/admin/ContentEditorPage';
import { ContentListPage } from '../pages/admin/ContentListPage';
import { TestimonialEditorPage } from '../pages/admin/testimonials/TestimonialEditorPage';
import { TestimonialListPage } from '../pages/admin/testimonials/TestimonialListPage';
import { TestimonialReviewPage } from '../pages/admin/testimonials/TestimonialReviewPage';
import { MediaLibraryPage } from '../pages/admin/media/MediaLibraryPage';
import { AdminProfilePage } from '../pages/admin/profile/AdminProfilePage';
import { WebsiteSettingsPage } from '../pages/admin/settings/WebsiteSettingsPage';
import { EnquiriesPage } from '../pages/admin/enquiries/EnquiriesPage';
import { OverviewPage } from '../pages/admin/OverviewPage';
import { AdminLoginPage } from '../pages/admin/login/AdminLoginPage';
import { AboutPage } from '../pages/about/AboutPage';
import { HomePage } from '../pages/home/HomePage';
import { ArticleDetailPage } from '../pages/insights/ArticleDetailPage';
import { InsightsPage } from '../pages/insights/InsightsPage';
import { CaseStudyDetailPage } from '../pages/client-stories/CaseStudyDetailPage';
import { ClientStoriesPage } from '../pages/client-stories/ClientStoriesPage';
import { TestimonialSubmissionPage } from '../pages/testimonials/TestimonialSubmissionPage';
import { ContactPage } from '../pages/contact/ContactPage';
import { PartnershipApplicationPage } from '../pages/partnership/PartnershipApplicationPage';
import { PartnershipApplicationsPage } from '../pages/admin/partnership/PartnershipApplicationsPage';
import { SubscribersPage } from '../pages/admin/subscribers/SubscribersPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivacyPolicyPage } from '../pages/legal/PrivacyPolicyPage';
import { TermsOfServicePage } from '../pages/legal/TermsOfServicePage';
import { UnsubscribePage } from '../pages/subscribers/UnsubscribePage';
import { apiRequest } from '../lib/api';

async function requireAdminSession() {
  try {
    return await apiRequest('/auth/session');
  } catch {
    throw redirect('/admin/login');
  }
}

export const router = createBrowserRouter([
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/testimonial/:token', element: <TestimonialSubmissionPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    loader: requireAdminSession,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'articles', element: <ContentListPage type="articles" /> },
      { path: 'articles/new', element: <ContentEditorPage type="articles" /> },
      { path: 'articles/:id/edit', element: <ContentEditorPage type="articles" /> },
      { path: 'case-studies', element: <ContentListPage type="case-studies" /> },
      { path: 'case-studies/new', element: <ContentEditorPage type="case-studies" /> },
      { path: 'case-studies/:id/edit', element: <ContentEditorPage type="case-studies" /> },
      { path: 'testimonials', element: <TestimonialListPage /> },
      { path: 'testimonials/new', element: <TestimonialEditorPage /> },
      { path: 'testimonials/:id/review', element: <TestimonialReviewPage /> },
      { path: 'testimonials/:id/edit', element: <TestimonialEditorPage /> },
      { path: 'media', element: <MediaLibraryPage /> },
      { path: 'enquiries', element: <EnquiriesPage /> },
      { path: 'partnership-applications', element: <PartnershipApplicationsPage /> },
      { path: 'subscribers', element: <SubscribersPage /> },
      { path: 'settings', element: <WebsiteSettingsPage /> },
      { path: 'profile', element: <AdminProfilePage /> },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/client-stories', element: <ClientStoriesPage /> },
      { path: '/client-stories/:slug', element: <CaseStudyDetailPage /> },
      { path: '/insights', element: <InsightsPage /> },
      { path: '/insights/:slug', element: <ArticleDetailPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/linkedin-partnership', element: <PartnershipApplicationPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/terms', element: <TermsOfServicePage /> },
      { path: '/unsubscribe', element: <UnsubscribePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);


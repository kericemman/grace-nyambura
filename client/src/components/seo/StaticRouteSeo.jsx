import { useLocation } from 'react-router-dom';
import { Seo, SITE_URL } from './Seo';

const routes = {
  '/': {
    title: 'LinkedIn Content & Personal Brand Partner | Grace Nyambura',
    description: 'I help B2B founders communicate their expertise through authentic, strategic LinkedIn content and personal brand positioning.',
    structuredData: {
      '@context': 'https://schema.org', '@type': 'ProfessionalService',
      name: 'Grace Nyambura', url: SITE_URL, areaServed: 'Worldwide',
      founder: { '@type': 'Person', name: 'Grace Nyambura', jobTitle: 'LinkedIn Content and Personal Brand Partner', url: `${SITE_URL}/about` },
      sameAs: ['https://www.linkedin.com/in/gracenyamburamuturi/', 'https://www.instagram.com/gra_cenyambura/'],
    },
  },
  '/about': { title: 'About Me', description: 'Learn about my journalism background and thoughtful approach to helping founders turn their expertise into clear, credible LinkedIn content.' },
  '/insights': { title: 'LinkedIn and Personal Brand Insights', description: 'Read practical perspectives on founder visibility, LinkedIn content, storytelling, authority, and communicating expertise clearly.' },
  '/client-stories': { title: 'Client Stories', description: 'Explore approved client stories showing how I approach founder positioning, LinkedIn content, and personal brand communication.' },
  '/contact': { title: 'Contact Me', description: 'Tell me about your LinkedIn content goals, current visibility challenges, and the support you need.' },
  '/linkedin-partnership': { title: 'LinkedIn Content Partnership', description: 'Apply for an ongoing LinkedIn content partnership built around your voice, expertise, positioning, and business goals.' },
  '/privacy-policy': { title: 'Privacy Policy', description: 'Read how I collect, use, store, and protect information submitted through this website.' },
  '/terms': { title: 'Terms of Service', description: 'Read the terms governing use of this website, its forms, content, and professional service enquiries.' },
};

export function StaticRouteSeo() {
  const { pathname } = useLocation();
  const metadata = routes[pathname];
  if (metadata) return <Seo canonicalPath={pathname} {...metadata} />;
  if (pathname === '/unsubscribe') return <Seo canonicalPath={pathname} description="Manage your mailing-list subscription." noIndex title="Unsubscribe" />;
  return null;
}

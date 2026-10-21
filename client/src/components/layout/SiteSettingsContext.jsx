import { createContext, useContext } from 'react';

export const defaultSiteSettings = {
  businessEmail: 'hello@gracenyambura.com',
  phone: '+254724345650',
  linkedInUrl: 'https://www.linkedin.com/in/gracenyamburamuturi/',
  instagramUrl: 'https://www.instagram.com/gra_cenyambura/',
  facebookUrl: 'https://www.facebook.com/grace.nyambura.698879',
  calendlyUrl: '',
  homepageCta: 'Book a Discovery Call',
  serviceStartingPrice: '$400/month',
  minimumEngagement: 'Three months',
  footerText: 'Writing in your voice.',
  defaultMetaDescription: '',
  openGraphImage: '',
};

export const SiteSettingsContext = createContext(defaultSiteSettings);
export const useSiteSettings = () => useContext(SiteSettingsContext);

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../lib/api';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { defaultSiteSettings, SiteSettingsContext } from './SiteSettingsContext';
import { SubscribeModal } from './SubscribeModal';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { StaticRouteSeo } from '../seo/StaticRouteSeo';

export function PublicLayout() {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const query = useQuery({ queryKey: ['public-settings'], queryFn: () => apiRequest('/public/settings') });
  const settings = { ...defaultSiteSettings, ...query.data?.data };

  return (
    <SiteSettingsContext.Provider value={settings}>
    <div className="min-h-screen overflow-x-clip bg-ivory text-body">
      <StaticRouteSeo />
      <a className="fixed top-4 left-4 z-[60] -translate-y-[200%] bg-white px-4 py-3 text-primary focus:translate-y-0" href="#main-content">
        Skip to content
      </a>
      <SiteHeader onSubscribe={() => setSubscribeOpen(true)} />
      <main id="main-content">
        <Outlet context={{ onSubscribe: () => setSubscribeOpen(true) }} />
      </main>
      <SiteFooter />
      <FloatingWhatsApp phone={settings.phone} />
      {subscribeOpen && <SubscribeModal onClose={() => setSubscribeOpen(false)} />}
    </div>
    </SiteSettingsContext.Provider>
  );
}


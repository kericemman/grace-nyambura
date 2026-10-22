import { useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopbar } from './components/AdminTopbar';
import { Seo } from '../../components/seo/Seo';

export function AdminLayout() {
  const session = useLoaderData();
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-body">
      <Seo canonicalPath="/admin" description="Private website administration." noIndex title="Administration" />
      <AdminSidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="min-h-screen lg:pl-[18rem]">
        <AdminTopbar user={session?.data?.user} onOpenNavigation={() => setNavigationOpen(true)} />
        <Outlet context={{ user: session?.data?.user }} />
      </div>
    </div>
  );
}

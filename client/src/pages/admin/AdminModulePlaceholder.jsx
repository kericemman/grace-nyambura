import { useLocation } from 'react-router-dom';

const labels = {
  articles: 'Articles',
  'case-studies': 'Client Case Studies',
  testimonials: 'Testimonials',
  media: 'Media Library',
  enquiries: 'Enquiries',
  settings: 'Website Settings',
  profile: 'Admin Profile',
};

export function AdminModulePlaceholder() {
  const segment = useLocation().pathname.split('/')[2] ?? '';
  const label = labels[segment] ?? 'Admin workspace';

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Admin module</p>
        <h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">{label}</h1>
        <div className="mt-10 border border-border bg-white p-8 text-muted">
          This workspace is ready for its management tools.
        </div>
      </div>
    </main>
  );
}

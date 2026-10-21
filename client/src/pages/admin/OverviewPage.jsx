import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BriefcaseBusiness, FileCheck2, FilePenLine, FileText, Inbox, MailPlus, Plus, Send, ShieldCheck } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const metricDefinitions = [
  { key: 'totalArticles', label: 'Total articles', icon: FileText, accent: 'bg-primary/10 text-primary' },
  { key: 'publishedArticles', label: 'Published articles', icon: FileCheck2, accent: 'bg-emerald/10 text-emerald' },
  { key: 'draftArticles', label: 'Draft articles', icon: FilePenLine, accent: 'bg-champagne/25 text-primary' },
  { key: 'publishedCaseStudies', label: 'Published case studies', icon: BriefcaseBusiness, accent: 'bg-primary/10 text-primary' },
  { key: 'unreviewedCaseStudies', label: 'Cases awaiting review', icon: ShieldCheck, accent: 'bg-champagne/25 text-primary' },
  { key: 'newEnquiries', label: 'New enquiries', icon: Inbox, accent: 'bg-emerald/10 text-emerald' },
  { key: 'newPartnershipApplications', label: 'New partnership applications', icon: Send, accent: 'bg-champagne/25 text-primary' },
  { key: 'activeSubscribers', label: 'Active subscribers', icon: MailPlus, accent: 'bg-emerald/10 text-emerald' },
];

export function OverviewPage() {
  const { user } = useOutletContext();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => apiRequest('/admin/overview'),
  });
  const counts = data?.data?.counts ?? {};

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Overview</p>
            <h1 className="mt-3 font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Grace'}.
            </h1>
            <p className="mt-3 text-muted">Here is what is happening across your content workspace.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary px-4 text-sm font-bold text-primary transition hover:bg-white" to="/admin/case-studies/new">
              <Plus size={16} aria-hidden="true" />
              New case study
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-bold text-white transition hover:bg-[#29324f]" to="/admin/articles/new">
              <Plus size={16} aria-hidden="true" />
              New article
            </Link>
          </div>
        </div>

        {isError && (
          <div className="mt-8 border-l-2 border-red-700 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">
            The overview could not be loaded. Refresh the page or try again shortly.
          </div>
        )}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Content metrics">
          {metricDefinitions.map(({ key, label, icon: Icon, accent }) => (
            <article className="border border-border bg-white p-5 shadow-[0_8px_28px_rgba(27,34,56,0.035)] sm:p-6" key={key}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted">{label}</p>
                  <p className="mt-4 font-display text-4xl leading-none text-primary">{isLoading ? '—' : (counts[key] ?? 0)}</p>
                </div>
                <span className={`grid h-11 w-11 place-items-center ${accent}`}>
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                </span>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="border border-border bg-white">
            <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Recent enquiries</h2>
                <p className="mt-1 text-sm text-muted">New conversations from the website.</p>
              </div>
              <Link className="hidden items-center gap-2 text-sm font-bold text-primary hover:text-emerald sm:flex" to="/admin/enquiries">
                View all <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <EmptyState icon={Inbox} title="No enquiries yet" copy="New website enquiries will appear here as they arrive." />
          </section>

          <section className="border border-border bg-white">
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Recently updated</h2>
              <p className="mt-1 text-sm text-muted">Your latest content changes.</p>
            </div>
            <EmptyState icon={FilePenLine} title="No content updates yet" copy="Create an article or case study to begin building your library." />
          </section>
        </div>
      </div>
    </main>
  );
}

function EmptyState({ icon: Icon, title, copy }) {
  return (
    <div className="grid min-h-64 place-items-center px-6 py-10 text-center">
      <div>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ivory text-muted">
          <Icon size={20} aria-hidden="true" />
        </span>
        <p className="mt-4 font-semibold text-primary">{title}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{copy}</p>
      </div>
    </div>
  );
}

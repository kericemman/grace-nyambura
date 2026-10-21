import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Archive,
  ArrowLeft,
  Check,
  ExternalLink,
  LoaderCircle,
  Pencil,
  ShieldCheck,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../../lib/api';

export function TestimonialReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['testimonial', id],
    queryFn: () => apiRequest(`/admin/testimonials/${id}`),
  });
  const updateStatus = useMutation({
    mutationFn: (status) => {
      const item = query.data.data;
      return apiRequest(`/admin/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          clientName: item.clientName,
          clientRole: item.clientRole,
          company: item.company,
          quote: item.quote,
          photo: item.photo,
          sourceUrl: item.sourceUrl,
          caseStudy: item.caseStudy?._id ?? item.caseStudy ?? null,
          permissionConfirmed: item.permissionConfirmed,
          featured: item.featured,
          status,
        }),
      });
    },
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', id] });
      if (status === 'published') navigate('/admin/testimonials');
    },
  });

  if (query.isLoading) {
    return (
      <main className="grid min-h-[60vh] place-items-center text-muted">
        Loading submission…
      </main>
    );
  }

  if (query.isError) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-5 text-center">
        <div>
          <h1 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">
            We could not load this testimonial.
          </h1>
          <p className="mt-4 text-muted">{query.error.message}</p>
        </div>
      </main>
    );
  }

  const item = query.data.data;
  const canPublish = item.permissionConfirmed && item.quote;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary"
              to="/admin/testimonials"
            >
              <ArrowLeft size={16} /> Back to testimonials
            </Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald">
              Client submission
            </p>
            <h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
              Review testimonial
            </h1>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary px-4 text-sm font-bold text-primary"
            to={`/admin/testimonials/${id}/edit`}
          >
            <Pencil size={16} /> Edit details
          </Link>
        </div>

        {updateStatus.error && (
          <div className="mt-6 border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-800">
            {updateStatus.error.message}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="border border-border bg-white p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-center">
              {item.photo ? (
                <img
                  className="h-24 w-24 rounded-full bg-ivory object-contain p-1"
                  src={item.photo}
                  alt={`${item.clientName} photo or company logo`}
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-full bg-primary font-display text-3xl text-white">
                  {item.clientName.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">
                  {item.clientName}
                </h2>
                <p className="mt-2 text-muted">
                  {[item.clientRole, item.company].filter(Boolean).join(', ')}
                </p>
                <Status status={item.status} />
              </div>
            </div>

            <blockquote className="py-9 font-display text-xl leading-relaxed text-primary md:text-2xl lg:text-3xl">
              “{item.quote}”
            </blockquote>

            {item.sourceUrl && (
              <a
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald hover:underline"
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                View original source <ExternalLink size={15} />
              </a>
            )}
          </article>

          <aside className="self-start border border-border bg-white p-5 lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">
              Approval
            </h2>
            <div className="mt-6 flex items-start gap-3 bg-ivory p-4 text-sm leading-6">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald" size={19} />
              <p>
                {item.permissionConfirmed
                  ? 'The client confirmed permission to publish their words and uploaded image.'
                  : 'Publication permission has not been confirmed.'}
              </p>
            </div>

            <button
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-emerald px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!canPublish || updateStatus.isPending || item.status === 'published'}
              onClick={() => updateStatus.mutate('published')}
            >
              {updateStatus.isPending ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <Check size={17} />
              )}
              {item.status === 'published' ? 'Published' : 'Approve and publish'}
            </button>

            {item.status !== 'archived' && (
              <button
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-border px-4 text-sm font-bold text-muted hover:text-primary"
                type="button"
                disabled={updateStatus.isPending}
                onClick={() => updateStatus.mutate('archived')}
              >
                <Archive size={16} /> Archive submission
              </button>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Status({ status }) {
  const colors = {
    published: 'bg-emerald/10 text-emerald',
    submitted: 'bg-champagne/30 text-primary',
    archived: 'bg-primary/10 text-primary',
    requested: 'bg-blue-50 text-blue-800',
  };

  return (
    <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${colors[status]}`}>
      {status}
    </span>
  );
}

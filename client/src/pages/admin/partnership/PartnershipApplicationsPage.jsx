import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  Mail,
  Phone,
  Save,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { apiRequest } from '../../../lib/api';

const statuses = ['new', 'reviewing', 'qualified', 'accepted', 'declined'];

export function PartnershipApplicationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const query = useQuery({
    queryKey: ['partnership-applications', search, status],
    queryFn: () => apiRequest(
      `/admin/partnership-applications?search=${encodeURIComponent(search)}&status=${status}`,
    ),
  });

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
            Main offer
          </p>
          <h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
            Partnership applications
          </h1>
          <p className="mt-2 text-muted">
            Review potential LinkedIn Content Partnership clients and record next steps.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search applications</span>
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={17} />
            <input
              className="min-h-11 w-full border border-border pl-10 pr-3 outline-none focus:border-emerald"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search names, companies, or goals"
            />
          </label>
          <select
            className="min-h-11 border border-border bg-white px-3 text-sm outline-none focus:border-emerald"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {statuses.map((item) => <option value={item} key={item}>{labelStatus(item)}</option>)}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[50rem] text-left">
            <thead className="border-b border-border bg-ivory text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Primary goal</th>
                <th className="px-5 py-4">Start</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {query.data?.data?.map((item) => (
                <tr
                  className="cursor-pointer transition hover:bg-ivory/70"
                  key={item._id}
                  tabIndex="0"
                  onClick={() => setSelected(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') setSelected(item);
                  }}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-primary">{item.fullName}</p>
                    <p className="mt-1 text-xs text-muted">{item.company} · {item.email}</p>
                  </td>
                  <td className="max-w-xs px-5 py-4 text-sm text-muted">{item.primaryGoal}</td>
                  <td className="px-5 py-4 text-sm text-muted">{item.desiredStart}</td>
                  <td className="px-5 py-4"><Status value={item.status} /></td>
                  <td className="px-5 py-4 text-sm text-muted">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {query.isLoading && <div className="grid min-h-60 place-items-center text-muted">Loading…</div>}
          {!query.isLoading && !query.data?.data?.length && (
            <div className="grid min-h-60 place-items-center px-6 text-center text-muted">
              No partnership applications found.
            </div>
          )}
        </div>
      </div>

      {selected && (
        <ApplicationPanel
          application={selected}
          key={selected._id}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function ApplicationPanel({ application, onClose }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.internalNotes || '');
  const save = useMutation({
    mutationFn: () => apiRequest(`/admin/partnership-applications/${application._id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, internalNotes: notes }),
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['partnership-applications'],
    }),
  });

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end bg-primary/55 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
              Partnership application
            </p>
            <h2 className="mt-2 font-display text-xl text-primary md:text-2xl lg:text-3xl">
              {application.fullName}
            </h2>
          </div>
          <button className="grid h-11 w-11 place-items-center text-muted" type="button" onClick={onClose} aria-label="Close application">
            <X size={21} />
          </button>
        </div>

        <div className="space-y-8 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail icon={BriefcaseBusiness} label="Company" value={application.company} />
            <Detail icon={UserRound} label="Role" value={application.professionalRole} />
            <Detail icon={Mail} label="Email" value={application.email} href={`mailto:${application.email}`} />
            <Detail icon={Phone} label="Phone" value={application.phone} href={`tel:${application.phone}`} />
            <Detail icon={CalendarDays} label="Received" value={formatDate(application.createdAt)} />
            {application.linkedInUrl && (
              <Detail icon={ExternalLink} label="LinkedIn" value="Open profile" href={application.linkedInUrl} />
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Answer label="Primary goal" value={application.primaryGoal} />
            <Answer label="Current posting rhythm" value={application.currentPostingRhythm} />
            <Answer label="Desired start" value={application.desiredStart} />
          </div>

          {application.additionalContext && (
            <Answer label="Additional context" value={application.additionalContext} />
          )}

          <div className="grid gap-5 border-t border-border pt-7">
            <label className="text-sm font-semibold text-primary">
              Status
              <select className="mt-2 min-h-11 w-full border border-border bg-white px-3 font-normal" value={status} onChange={(event) => setStatus(event.target.value)}>
                {statuses.map((item) => <option value={item} key={item}>{labelStatus(item)}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-primary">
              Internal notes
              <textarea className="mt-2 min-h-36 w-full resize-y border border-border p-3 font-normal" value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>
            {save.error && <p className="text-sm text-red-700">{save.error.message}</p>}
            <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-white disabled:opacity-60 sm:justify-self-start" type="button" disabled={save.isPending} onClick={() => save.mutate()}>
              <Save size={16} /> {save.isPending ? 'Saving…' : save.isSuccess ? 'Saved' : 'Save changes'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Answer({ label, value }) {
  return <section><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p><p className="mt-3 whitespace-pre-wrap leading-7 text-body">{value}</p></section>;
}

function Detail({ href, icon: Icon, label, value }) {
  const content = <><Icon className="mt-0.5 shrink-0 text-emerald" size={17} /><span><span className="block text-xs font-bold uppercase tracking-wider text-muted">{label}</span><span className="mt-1 block break-words text-sm font-semibold text-primary">{value}</span></span></>;
  return href ? <a className="flex gap-3 border border-border p-4 hover:border-emerald" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a> : <div className="flex gap-3 border border-border p-4">{content}</div>;
}

function Status({ value }) {
  const colors = {
    new: 'bg-blue-50 text-blue-800',
    reviewing: 'bg-champagne/30 text-primary',
    qualified: 'bg-emerald/10 text-emerald',
    accepted: 'bg-primary text-white',
    declined: 'bg-primary/10 text-muted',
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${colors[value]}`}>{labelStatus(value)}</span>;
}

function labelStatus(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

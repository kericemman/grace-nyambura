import { useQuery } from '@tanstack/react-query';
import { Mail, Search, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { apiRequest } from '../../../lib/api';

export function SubscribersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const query = useQuery({
    queryKey: ['subscribers', search, status],
    queryFn: () => apiRequest(
      `/admin/subscribers?search=${encodeURIComponent(search)}&status=${status}`,
    ),
  });

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
            Audience
          </p>
          <h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
            Mailing list
          </h1>
          <p className="mt-2 text-muted">
            People who subscribed through the public website.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search subscribers</span>
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={17} />
            <input
              className="min-h-11 w-full border border-border pl-10 pr-3 outline-none focus:border-emerald"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search names or email addresses"
            />
          </label>
          <select
            className="min-h-11 border border-border bg-white px-3 text-sm outline-none focus:border-emerald"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter subscribers by status"
          >
            <option value="">All subscribers</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[42rem] text-left">
            <thead className="border-b border-border bg-ivory text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4">Subscriber</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {query.data?.data?.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-ivory/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-primary">{subscriber.name}</p>
                    <a className="mt-1 inline-flex items-center gap-1 text-sm text-muted hover:text-emerald" href={`mailto:${subscriber.email}`}>
                      <Mail size={14} /> {subscriber.email}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${subscriber.status === 'active' ? 'bg-emerald/10 text-emerald' : 'bg-primary/10 text-muted'}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm capitalize text-muted">{subscriber.source}</td>
                  <td className="px-5 py-4 text-sm text-muted">{formatDate(subscriber.subscribedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {query.isLoading && <div className="grid min-h-60 place-items-center text-muted">Loading…</div>}
          {!query.isLoading && !query.data?.data?.length && (
            <div className="grid min-h-60 place-items-center px-6 text-center text-muted">
              <div>
                <UsersRound className="mx-auto text-muted/50" size={30} />
                <p className="mt-4">No subscribers found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const configs = {
  articles: { title: 'Articles', singular: 'article', endpoint: '/admin/articles', field: 'title' },
  'case-studies': { title: 'Client Case Studies', singular: 'case study', endpoint: '/admin/case-studies', field: 'projectTitle' },
};

export function ContentListPage({ type }) {
  const config = configs[type];
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const query = useQuery({
    queryKey: [type, search, status],
    queryFn: () => apiRequest(`${config.endpoint}?search=${encodeURIComponent(search)}&status=${status}`),
  });
  const remove = useMutation({
    mutationFn: (id) => apiRequest(`${config.endpoint}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [type] }),
  });

  function deleteItem(item) {
    if (window.confirm(`Delete “${item[config.field]}”? This cannot be undone.`)) remove.mutate(item._id);
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Content library</p>
            <h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">{config.title}</h1>
          </div>
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-bold text-white" to={`/admin/${type}/new`}>
            <Plus size={16} aria-hidden="true" /> New {config.singular}
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search</span>
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={17} aria-hidden="true" />
            <input className="min-h-11 w-full border border-border pl-10 pr-3 outline-none focus:border-emerald" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} />
          </label>
          <select className="min-h-11 border border-border bg-white px-3 text-sm text-body outline-none focus:border-emerald" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[46rem] text-left">
            <thead className="border-b border-border bg-ivory text-xs uppercase tracking-wider text-muted">
              <tr><th className="px-5 py-4 font-semibold">Title</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Updated</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {query.data?.data?.map((item) => (
                <tr className="hover:bg-ivory/60" key={item._id}>
                  <td className="px-5 py-4"><p className="font-semibold text-primary">{item[config.field]}</p><p className="mt-1 text-xs text-muted">/{item.slug}</p></td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-sm text-muted">{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.updatedAt))}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><Link className="grid h-9 w-9 place-items-center border border-border text-muted hover:border-primary hover:text-primary" to={`/admin/${type}/${item._id}/edit`} aria-label={`Edit ${item[config.field]}`}><Edit3 size={16} /></Link><button className="grid h-9 w-9 place-items-center border border-border text-muted hover:border-red-700 hover:text-red-700" type="button" onClick={() => deleteItem(item)} aria-label={`Delete ${item[config.field]}`}><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!query.isLoading && !query.data?.data?.length && <div className="grid min-h-60 place-items-center p-8 text-center text-muted">No {config.title.toLowerCase()} found.</div>}
          {query.isLoading && <div className="grid min-h-60 place-items-center text-muted">Loading…</div>}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }) {
  const colors = status === 'published' ? 'bg-emerald/10 text-emerald' : status === 'archived' ? 'bg-primary/10 text-primary' : 'bg-champagne/25 text-primary';
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${colors}`}>{status}</span>;
}

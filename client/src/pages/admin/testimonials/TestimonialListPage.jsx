import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Edit3, Eye, Link2, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../../lib/api';

export function TestimonialListPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);
  const query = useQuery({ queryKey: ['testimonials', search, status], queryFn: () => apiRequest(`/admin/testimonials?search=${encodeURIComponent(search)}&status=${status}`) });
  const remove = useMutation({ mutationFn: (id) => apiRequest(`/admin/testimonials/${id}`, { method: 'DELETE' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }) });

  function deleteItem(item) {
    if (window.confirm(`Delete the testimonial request for ${item.clientName}? This cannot be undone.`)) remove.mutate(item._id);
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Social proof</p><h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">Testimonials</h1><p className="mt-2 text-muted">Request, review, and publish client feedback with explicit permission.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary px-4 text-sm font-bold text-primary hover:bg-white" type="button" onClick={() => setRequestOpen(true)}><Link2 size={16} /> Create private request</button>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-bold text-white" to="/admin/testimonials/new"><Plus size={16} /> Add testimonial</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row">
          <label className="relative flex-1"><span className="sr-only">Search testimonials</span><Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={17} /><input className="min-h-11 w-full border border-border pl-10 pr-3 outline-none focus:border-emerald" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients or companies" /></label>
          <select className="min-h-11 border border-border bg-white px-3 text-sm outline-none focus:border-emerald" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="">All statuses</option><option value="requested">Requested</option><option value="submitted">Submitted</option><option value="published">Published</option><option value="archived">Archived</option></select>
        </div>

        <div className="mt-5 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[48rem] text-left">
            <thead className="border-b border-border bg-ivory text-xs uppercase tracking-wider text-muted"><tr><th className="px-5 py-4">Client</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Permission</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {query.data?.data?.map((item) => (
                <tr className="hover:bg-ivory/60" key={item._id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.photo ? (
                        <img
                          className="h-10 w-10 rounded-full bg-ivory object-contain p-0.5"
                          src={item.photo}
                          alt=""
                        />
                      ) : null}
                      <div>
                        <p className="font-semibold text-primary">{item.clientName}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.clientRole ? `${item.clientRole}, ` : ''}{item.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><Status status={item.status} /></td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${item.permissionConfirmed ? 'text-emerald' : 'text-muted'}`}>
                      {item.permissionConfirmed ? <Check size={15} /> : <X size={15} />}
                      {item.permissionConfirmed ? 'Confirmed' : 'Not confirmed'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.updatedAt))}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {item.status === 'submitted' && (
                        <Link
                          className="grid h-9 w-9 place-items-center bg-emerald text-white"
                          to={`/admin/testimonials/${item._id}/review`}
                          aria-label={`Review ${item.clientName}`}
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                      <Link
                        className="grid h-9 w-9 place-items-center border border-border text-muted hover:text-primary"
                        to={`/admin/testimonials/${item._id}/edit`}
                        aria-label={`Edit ${item.clientName}`}
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        className="grid h-9 w-9 place-items-center border border-border text-muted hover:border-red-700 hover:text-red-700"
                        type="button"
                        onClick={() => deleteItem(item)}
                        aria-label={`Delete ${item.clientName}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!query.isLoading && !query.data?.data?.length && <div className="grid min-h-60 place-items-center px-6 text-center text-muted">No testimonials found.</div>}
          {query.isLoading && <div className="grid min-h-60 place-items-center text-muted">Loading…</div>}
        </div>
      </div>
      {requestOpen && <RequestDialog onClose={() => setRequestOpen(false)} onCreated={() => queryClient.invalidateQueries({ queryKey: ['testimonials'] })} />}
    </main>
  );
}

function RequestDialog({ onClose, onCreated }) {
  const [form, setForm] = useState({ clientName: '', clientRole: '', company: '', email: '', expiresInDays: 30 });
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const request = useMutation({ mutationFn: () => apiRequest('/admin/testimonial-requests', { method: 'POST', body: JSON.stringify(form) }), onSuccess: (result) => { setLink(`${window.location.origin}/testimonial/${result.data.token}`); onCreated(); } });
  function update(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  async function copyLink() { await navigator.clipboard.writeText(link); setCopied(true); }

  return <div className="fixed inset-0 z-[70] grid place-items-center bg-primary/60 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Private request</p><h2 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">Create testimonial link</h2></div><button className="grid h-10 w-10 place-items-center text-muted" onClick={onClose} aria-label="Close"><X size={20} /></button></div>{link ? <div className="mt-8"><p className="leading-7 text-muted">Share this private, one-time link with the client. It will expire automatically.</p><div className="mt-5 flex"><input className="min-h-12 min-w-0 flex-1 border border-border px-3 text-sm" readOnly value={link} /><button className="inline-flex items-center gap-2 bg-primary px-4 text-sm font-bold text-white" type="button" onClick={copyLink}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button></div><button className="mt-6 text-sm font-bold text-primary" type="button" onClick={onClose}>Done</button></div> : <form className="mt-8 grid gap-5" onSubmit={(event) => { event.preventDefault(); request.mutate(); }}><Input label="Client name" value={form.clientName} onChange={(value) => update('clientName', value)} required /><Input label="Role" value={form.clientRole} onChange={(value) => update('clientRole', value)} /><Input label="Company" value={form.company} onChange={(value) => update('company', value)} required /><Input label="Email for your reference" type="email" value={form.email} onChange={(value) => update('email', value)} /><label className="text-sm font-semibold text-primary">Link expires in<select className="mt-2 min-h-11 w-full border border-border bg-white px-3 font-normal" value={form.expiresInDays} onChange={(event) => update('expiresInDays', Number(event.target.value))}><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option><option value={60}>60 days</option><option value={90}>90 days</option></select></label>{request.error && <p className="text-sm text-red-700">{request.error.message}</p>}<button className="min-h-12 bg-primary px-5 font-bold text-white disabled:opacity-60" disabled={request.isPending}>{request.isPending ? 'Creating…' : 'Create private link'}</button></form>}</div></div>;
}

function Input({ label, onChange, required, type = 'text', value }) { return <label className="text-sm font-semibold text-primary">{label}<input className="mt-2 min-h-11 w-full border border-border px-3 font-normal outline-none focus:border-emerald" type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function Status({ status }) { const color = status === 'published' ? 'bg-emerald/10 text-emerald' : status === 'submitted' ? 'bg-champagne/30 text-primary' : status === 'archived' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-800'; return <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${color}`}>{status}</span>; }

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, ImagePlus, LoaderCircle, Pencil, Search, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { apiRequest } from '../../../lib/api';

const categories = ['general', 'portrait', 'article', 'case-study', 'testimonial', 'social'];

export function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const query = useQuery({ queryKey: ['media', search, category], queryFn: () => apiRequest(`/admin/media?search=${encodeURIComponent(search)}&category=${category}`) });

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Asset library</p><h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">Media Library</h1><p className="mt-2 text-muted">Upload, organize, and reuse website images.</p></div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-bold text-white" type="button" onClick={() => setUploadOpen(true)}><Upload size={16} /> Upload images</button>
        </div>

        <div className="mt-8 flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row">
          <label className="relative flex-1"><span className="sr-only">Search media</span><Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={17} /><input className="min-h-11 w-full border border-border pl-10 pr-3 outline-none focus:border-emerald" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search filename, alt text, or tags" /></label>
          <select className="min-h-11 border border-border bg-white px-3 text-sm capitalize outline-none focus:border-emerald" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select>
        </div>

        {query.isLoading && <div className="grid min-h-80 place-items-center text-muted">Loading media…</div>}
        {!query.isLoading && !query.data?.data?.length && <div className="mt-5 grid min-h-80 place-items-center border border-dashed border-border bg-white px-6 text-center"><div><ImagePlus className="mx-auto text-champagne" size={42} strokeWidth={1.4} /><p className="mt-5 font-display text-xl text-primary md:text-2xl lg:text-3xl">Your media library is ready.</p><p className="mt-3 text-muted">Upload images to begin building a reusable asset collection.</p></div></div>}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" aria-label="Media assets">
          {query.data?.data?.map((asset) => <button className="group overflow-hidden border border-border bg-white text-left transition hover:border-champagne hover:shadow-[0_14px_38px_rgba(27,34,56,0.08)]" type="button" key={asset._id} onClick={() => setSelected(asset)}><div className="aspect-square overflow-hidden bg-ivory"><img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" src={asset.url} alt={asset.altText || ''} loading="lazy" /></div><div className="p-4"><p className="truncate text-sm font-semibold text-primary">{asset.filename}</p><div className="mt-2 flex items-center justify-between gap-3"><span className="rounded-full bg-emerald/10 px-2.5 py-1 text-[0.65rem] font-bold capitalize text-emerald">{asset.category}</span><span className="text-xs text-muted">{asset.width}×{asset.height}</span></div></div></button>)}
        </section>
      </div>
      {uploadOpen && <UploadDialog onClose={() => setUploadOpen(false)} onComplete={() => queryClient.invalidateQueries({ queryKey: ['media'] })} />}
      {selected && <AssetDialog asset={selected} onClose={() => setSelected(null)} onChange={(asset) => { setSelected(asset); queryClient.invalidateQueries({ queryKey: ['media'] }); }} onDelete={() => { setSelected(null); queryClient.invalidateQueries({ queryKey: ['media'] }); }} />}
    </main>
  );
}

function UploadDialog({ onClose, onComplete }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('general');
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState('');
  const upload = useMutation({ mutationFn: async () => { const body = new FormData(); files.forEach((file) => body.append('images', file)); body.append('category', category); body.append('altText', altText); body.append('tags', tags); return apiRequest('/admin/media', { method: 'POST', body }); }, onSuccess: () => { onComplete(); onClose(); } });
  return <Modal title="Upload images" onClose={onClose}><form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); upload.mutate(); }}><label className="grid min-h-40 cursor-pointer place-items-center border border-dashed border-champagne bg-ivory p-6 text-center"><input className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 10))} /><span><Upload className="mx-auto text-emerald" size={26} /><span className="mt-3 block font-semibold text-primary">Choose up to 10 images</span><span className="mt-1 block text-sm text-muted">JPEG, PNG, WebP, or GIF · 8 MB each</span></span></label>{files.length > 0 && <p className="text-sm text-muted">{files.length} image{files.length === 1 ? '' : 's'} selected: {files.map((file) => file.name).join(', ')}</p>}<label className="text-sm font-semibold text-primary">Category<select className="mt-2 min-h-11 w-full border border-border bg-white px-3 font-normal capitalize" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><Input label="Alt text" value={altText} onChange={setAltText} hint="Applied to every image in this batch; refine each image afterward." /><Input label="Tags" value={tags} onChange={setTags} hint="Separate tags with commas." />{upload.error && <p className="text-sm text-red-700">{upload.error.message}</p>}<button className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-bold text-white disabled:opacity-60" disabled={!files.length || upload.isPending}>{upload.isPending && <LoaderCircle className="animate-spin" size={17} />}{upload.isPending ? 'Uploading…' : 'Upload images'}</button></form></Modal>;
}

function AssetDialog({ asset, onChange, onClose, onDelete }) {
  const replaceInput = useRef(null);
  const [form, setForm] = useState({ altText: asset.altText, category: asset.category, tags: asset.tags?.join(', ') ?? '' });
  const [copied, setCopied] = useState(false);
  const update = useMutation({ mutationFn: () => apiRequest(`/admin/media/${asset._id}`, { method: 'PUT', body: JSON.stringify({ ...form, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) }) }), onSuccess: (result) => onChange(result.data) });
  const replace = useMutation({ mutationFn: (file) => { const body = new FormData(); body.append('image', file); return apiRequest(`/admin/media/${asset._id}/replace`, { method: 'POST', body }); }, onSuccess: (result) => onChange(result.data) });
  const remove = useMutation({ mutationFn: () => apiRequest(`/admin/media/${asset._id}`, { method: 'DELETE' }), onSuccess: onDelete });
  async function copyUrl() { await navigator.clipboard.writeText(asset.url); setCopied(true); }
  function deleteAsset() { if (window.confirm('Delete this image from Cloudinary and the media library?')) remove.mutate(); }
  return <Modal title="Edit media" onClose={onClose}><img className="aspect-video w-full bg-ivory object-contain" src={asset.url} alt={asset.altText || ''} /><div className="mt-5 flex flex-wrap gap-3"><button className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-bold text-primary" type="button" onClick={copyUrl}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy URL'}</button><button className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-bold text-primary" type="button" onClick={() => replaceInput.current?.click()}>{replace.isPending ? <LoaderCircle className="animate-spin" size={15} /> : <Pencil size={15} />}Replace image</button><input className="sr-only" ref={replaceInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) replace.mutate(file); event.target.value = ''; }} /></div><div className="mt-6 grid gap-5"><Input label="Alt text" value={form.altText} onChange={(value) => setForm((current) => ({ ...current, altText: value }))} /><label className="text-sm font-semibold text-primary">Category<select className="mt-2 min-h-11 w-full border border-border bg-white px-3 font-normal capitalize" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><Input label="Tags" value={form.tags} onChange={(value) => setForm((current) => ({ ...current, tags: value }))} hint="Separate tags with commas." />{(update.error || replace.error || remove.error) && <p className="text-sm text-red-700">{update.error?.message || replace.error?.message || remove.error?.message}</p>}<div className="flex items-center justify-between gap-4"><button className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-red-700" type="button" disabled={remove.isPending} onClick={deleteAsset}><Trash2 size={16} /> Delete</button><button className="min-h-11 bg-primary px-5 text-sm font-bold text-white disabled:opacity-60" type="button" disabled={update.isPending} onClick={() => update.mutate()}>{update.isPending ? 'Saving…' : 'Save details'}</button></div></div></Modal>;
}

function Modal({ children, onClose, title }) { return <div className="fixed inset-0 z-[70] grid place-items-center bg-primary/60 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"><div className="mb-7 flex items-start justify-between"><h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h2><button className="grid h-10 w-10 place-items-center text-muted" type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}</div></div>; }
function Input({ hint, label, onChange, value }) { return <label className="text-sm font-semibold text-primary">{label}<input className="mt-2 min-h-11 w-full border border-border px-3 font-normal outline-none focus:border-emerald" value={value} onChange={(event) => onChange(event.target.value)} />{hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}</label>; }

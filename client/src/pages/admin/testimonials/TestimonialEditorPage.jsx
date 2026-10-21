import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, ImagePlus, LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { apiRequest } from '../../../lib/api';

const schema = z.object({
  clientName: z.string().min(2, 'Add the client name.'), clientRole: z.string(), company: z.string().min(2, 'Add the company.'),
  quote: z.string().min(20, 'The testimonial needs at least 20 characters.').max(3000),
  photo: z.union([z.literal(''), z.string().url('Enter a valid photo URL.')]), sourceUrl: z.union([z.literal(''), z.string().url('Enter a valid source URL.')]),
  caseStudy: z.string(), permissionConfirmed: z.boolean(), featured: z.boolean(), status: z.enum(['submitted', 'published', 'archived']),
});
const defaults = { clientName: '', clientRole: '', company: '', quote: '', photo: '', sourceUrl: '', caseStudy: '', permissionConfirmed: false, featured: false, status: 'submitted' };

export function TestimonialEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const photoInput = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults });
  const query = useQuery({ queryKey: ['testimonial', id], queryFn: () => apiRequest(`/admin/testimonials/${id}`), enabled: !isNew });
  const status = useWatch({ control: form.control, name: 'status' });
  const permission = useWatch({ control: form.control, name: 'permissionConfirmed' });
  const photo = useWatch({ control: form.control, name: 'photo' });
  useEffect(() => { if (query.data?.data) form.reset({ ...defaults, ...query.data.data, caseStudy: query.data.data.caseStudy ?? '' }); }, [form, query.data]);
  const save = useMutation({ mutationFn: (values) => apiRequest(isNew ? '/admin/testimonials' : `/admin/testimonials/${id}`, { method: isNew ? 'POST' : 'PUT', body: JSON.stringify({ ...values, caseStudy: values.caseStudy || null }) }), onSuccess: () => navigate('/admin/testimonials') });

  async function uploadPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadError('');
    setUploadingPhoto(true);
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('category', 'testimonial');
      const result = await apiRequest('/admin/media/editor-image', { method: 'POST', body });
      form.setValue('photo', result.data.url, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploadingPhoto(false);
    }
  }

  if (!isNew && query.isLoading) return <main className="grid min-h-[60vh] place-items-center text-muted">Loading testimonial…</main>;
  return <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><form className="mx-auto max-w-5xl" onSubmit={form.handleSubmit((values) => save.mutate(values))}><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary" to="/admin/testimonials"><ArrowLeft size={16} /> Back to testimonials</Link><h1 className="mt-4 font-display text-xl text-primary md:text-2xl lg:text-3xl">{isNew ? 'Add' : 'Review'} testimonial</h1></div><button className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-white disabled:opacity-60" disabled={save.isPending}>{save.isPending ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}{save.isPending ? 'Saving…' : 'Save testimonial'}</button></div>{save.error && <div className="mt-6 border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-800">{save.error.message}</div>}<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_19rem]"><section className="grid gap-6 border border-border bg-white p-5 sm:p-7"><div className="grid gap-6 sm:grid-cols-2"><Field label="Client name" name="clientName" form={form} /><Field label="Role" name="clientRole" form={form} /><Field label="Company" name="company" form={form} /><PhotoUpload photo={photo} inputRef={photoInput} uploading={uploadingPhoto} error={uploadError} onUpload={uploadPhoto} onRemove={() => form.setValue('photo', '', { shouldDirty: true })} /></div><label className="text-sm font-semibold text-primary">Testimonial<textarea className="mt-2 min-h-48 w-full resize-y border border-border p-3 font-normal leading-7 outline-none focus:border-emerald" {...form.register('quote')} />{form.formState.errors.quote && <span className="mt-2 block font-normal text-red-700">{form.formState.errors.quote.message}</span>}</label><Field label="Original source URL" name="sourceUrl" form={form} type="url" /><Field label="Related case study ID" name="caseStudy" form={form} /></section><aside className="self-start border border-border bg-white p-5 lg:sticky lg:top-28"><h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Publishing</h2><div className="mt-6 grid gap-5"><label className="text-sm font-semibold text-primary">Status<select className="mt-2 min-h-11 w-full border border-border bg-white px-3 font-normal" {...form.register('status')}><option value="submitted">Submitted</option><option value="published">Published</option><option value="archived">Archived</option></select></label><CheckField label="Client confirmed publication permission" name="permissionConfirmed" form={form} /><CheckField label="Feature this testimonial" name="featured" form={form} />{status === 'published' && !permission && <p className="border-l-2 border-champagne bg-ivory p-3 text-xs leading-5 text-muted">Permission must be confirmed before publishing.</p>}</div></aside></div></form></main>;
}

function PhotoUpload({ error, inputRef, onRemove, onUpload, photo, uploading }) {
  return <div><p className="text-sm font-semibold text-primary">Client photo</p><div className="mt-2 flex min-h-36 items-center gap-4 border border-border bg-ivory p-4">{photo ? <img className="h-24 w-24 shrink-0 rounded-full object-cover" src={photo} alt="Client preview" /> : <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white text-muted"><ImagePlus size={24} /></span>}<div><button className="inline-flex min-h-10 items-center gap-2 border border-primary bg-white px-3 text-sm font-bold text-primary disabled:opacity-60" type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>{uploading ? <LoaderCircle className="animate-spin" size={16} /> : <ImagePlus size={16} />}{uploading ? 'Uploading…' : photo ? 'Replace photo' : 'Upload from computer'}</button>{photo && <button className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-700" type="button" onClick={onRemove}><Trash2 size={15} /> Remove</button>}<input className="sr-only" ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onUpload} /></div></div>{error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}</div>;
}

function Field({ form, label, name, type = 'text' }) { const error = form.formState.errors[name]; return <label className="text-sm font-semibold text-primary">{label}<input className={`mt-2 min-h-11 w-full border px-3 font-normal outline-none focus:border-emerald ${error ? 'border-red-600' : 'border-border'}`} type={type} {...form.register(name)} />{error && <span className="mt-2 block font-normal text-red-700">{error.message}</span>}</label>; }
function CheckField({ form, label, name }) { return <label className="flex gap-3 text-sm leading-6 text-body"><input className="mt-1 h-4 w-4 accent-emerald" type="checkbox" {...form.register(name)} /><span>{label}</span></label>; }

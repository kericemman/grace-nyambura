import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '../../../lib/api';

const optionalUrl = z.union([z.literal(''), z.string().url('Enter a valid URL.')]);
const schema = z.object({
  businessEmail: z.string().email('Enter a valid email.'), phone: z.string().min(7, 'Enter a valid phone number.'),
  linkedInUrl: optionalUrl, instagramUrl: optionalUrl, facebookUrl: optionalUrl, calendlyUrl: optionalUrl,
  homepageCta: z.string().min(2).max(80), serviceStartingPrice: z.string().min(1).max(80), minimumEngagement: z.string().min(1).max(80),
  footerText: z.string().min(2).max(180), defaultMetaDescription: z.string().max(170), openGraphImage: optionalUrl,
});
const defaults = { businessEmail: '', phone: '', linkedInUrl: '', instagramUrl: '', facebookUrl: '', calendlyUrl: '', homepageCta: 'Book a Discovery Call', serviceStartingPrice: '$400/month', minimumEngagement: 'Three months', footerText: 'Writing in your voice.', defaultMetaDescription: '', openGraphImage: '' };

export function WebsiteSettingsPage() {
  const queryClient = useQueryClient();
  const imageInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saved, setSaved] = useState(false);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults });
  const image = useWatch({ control: form.control, name: 'openGraphImage' });
  const query = useQuery({ queryKey: ['website-settings'], queryFn: () => apiRequest('/admin/settings') });
  useEffect(() => { if (query.data?.data) form.reset({ ...defaults, ...query.data.data }); }, [form, query.data]);
  const save = useMutation({ mutationFn: (values) => apiRequest('/admin/settings', { method: 'PUT', body: JSON.stringify(values) }), onSuccess: (result) => { form.reset({ ...defaults, ...result.data }); queryClient.invalidateQueries({ queryKey: ['public-settings'] }); setSaved(true); window.setTimeout(() => setSaved(false), 2500); } });

  async function uploadImage(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    setUploading(true); setUploadError('');
    try { const body = new FormData(); body.append('image', file); body.append('category', 'social'); const result = await apiRequest('/admin/media/editor-image', { method: 'POST', body }); form.setValue('openGraphImage', result.data.url, { shouldDirty: true, shouldValidate: true }); }
    catch (error) { setUploadError(error.message); }
    finally { setUploading(false); }
  }

  if (query.isLoading) return <main className="grid min-h-[60vh] place-items-center text-muted">Loading settings…</main>;
  return <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><form className="mx-auto max-w-5xl" onSubmit={form.handleSubmit((values) => save.mutate(values))}><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Configuration</p><h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">Website Settings</h1><p className="mt-2 text-muted">The essential business details used across the website.</p></div><button className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-white disabled:opacity-60" disabled={save.isPending}>{save.isPending ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}{save.isPending ? 'Saving…' : saved ? 'Saved' : 'Save settings'}</button></div>{(save.error || query.error) && <div className="mt-6 border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-800">{save.error?.message || query.error?.message}</div>}<div className="mt-8 grid gap-6"><SettingsSection title="Contact & booking" copy="Used in the footer, contact page, and primary booking actions."><div className="grid gap-5 sm:grid-cols-2"><Field form={form} label="Business email" name="businessEmail" type="email" /><Field form={form} label="Phone number" name="phone" /><div className="sm:col-span-2"><Field form={form} label="Calendly or booking URL" name="calendlyUrl" type="url" placeholder="https://calendly.com/..." /></div></div></SettingsSection><SettingsSection title="Social links" copy="Leave a field empty to hide that social link."><div className="grid gap-5"><Field form={form} label="LinkedIn" name="linkedInUrl" type="url" /><Field form={form} label="Instagram" name="instagramUrl" type="url" /><Field form={form} label="Facebook" name="facebookUrl" type="url" /></div></SettingsSection><SettingsSection title="Offer details" copy="Simple labels shown with the LinkedIn Content Partnership."><div className="grid gap-5 sm:grid-cols-2"><Field form={form} label="Starting price" name="serviceStartingPrice" /><Field form={form} label="Minimum engagement" name="minimumEngagement" /><div className="sm:col-span-2"><Field form={form} label="Main call-to-action label" name="homepageCta" /></div></div></SettingsSection><SettingsSection title="Website defaults" copy="Basic footer and link-sharing information."><div className="grid gap-5"><Field form={form} label="Footer line" name="footerText" /><Textarea form={form} label="Default meta description" name="defaultMetaDescription" maxLength={170} /><div><p className="text-sm font-semibold text-primary">Default sharing image</p><div className="mt-2 flex flex-col gap-4 border border-border bg-ivory p-4 sm:flex-row sm:items-center">{image ? <img className="aspect-[1.91/1] w-full max-w-56 object-cover" src={image} alt="Sharing preview" /> : <span className="grid aspect-[1.91/1] w-full max-w-56 place-items-center bg-white text-muted"><ImagePlus size={25} /></span>}<div><button className="inline-flex min-h-10 items-center gap-2 border border-primary bg-white px-3 text-sm font-bold text-primary disabled:opacity-60" type="button" disabled={uploading} onClick={() => imageInput.current?.click()}>{uploading ? <LoaderCircle className="animate-spin" size={16} /> : <ImagePlus size={16} />}{uploading ? 'Uploading…' : image ? 'Replace image' : 'Upload image'}</button>{image && <button className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-700" type="button" onClick={() => form.setValue('openGraphImage', '', { shouldDirty: true })}><Trash2 size={15} /> Remove</button>}<input className="sr-only" ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} />{uploadError && <p className="mt-2 text-sm text-red-700">{uploadError}</p>}</div></div></div></div></SettingsSection></div></form></main>;
}

function SettingsSection({ children, copy, title }) { return <section className="grid gap-7 border border-border bg-white p-5 sm:p-7 md:grid-cols-[0.35fr_0.65fr]"><div><h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h2><p className="mt-3 text-sm leading-6 text-muted">{copy}</p></div><div>{children}</div></section>; }
function Field({ form, label, name, placeholder, type = 'text' }) { const error = form.formState.errors[name]; return <label className="text-sm font-semibold text-primary">{label}<input className={`mt-2 min-h-11 w-full border px-3 font-normal outline-none focus:border-emerald ${error ? 'border-red-600' : 'border-border'}`} type={type} placeholder={placeholder} {...form.register(name)} />{error && <span className="mt-2 block font-normal text-red-700">{error.message}</span>}</label>; }
function Textarea({ form, label, maxLength, name }) { const value = useWatch({ control: form.control, name }) ?? ''; const error = form.formState.errors[name]; return <label className="text-sm font-semibold text-primary">{label}<textarea className={`mt-2 min-h-28 w-full resize-y border p-3 font-normal outline-none focus:border-emerald ${error ? 'border-red-600' : 'border-border'}`} maxLength={maxLength} {...form.register(name)} /><span className="mt-1 flex justify-between text-xs font-normal text-muted"><span>{error?.message}</span><span>{value.length}/{maxLength}</span></span></label>; }

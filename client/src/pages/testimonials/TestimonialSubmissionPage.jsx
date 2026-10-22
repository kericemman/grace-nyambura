import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { apiRequest } from '../../lib/api';
import { Seo } from '../../components/seo/Seo';

const schema = z.object({
  clientName: z.string().min(2, 'Enter your name.'),
  clientRole: z.string(),
  company: z.string().min(2, 'Enter your company.'),
  quote: z
    .string()
    .min(20, 'Please share at least a few sentences.')
    .max(3000),
  sourceUrl: z.union([
    z.literal(''),
    z.string().url('Enter a valid URL.'),
  ]),
  permissionConfirmed: z.literal(true, {
    error: 'Please confirm publication permission.',
  }),
});

export function TestimonialSubmissionPage() {
  const { token } = useParams();
  const details = useQuery({
    queryKey: ['testimonial-request', token],
    queryFn: () => apiRequest(`/public/testimonial-requests/${token}`),
    retry: false,
  });

  if (details.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ivory text-muted">
        Checking your invitation…
      </main>
    );
  }

  if (details.isError) return <InvalidRequest />;

  return <SubmissionForm token={token} details={details.data.data} />;
}

function SubmissionForm({ token, details }) {
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const inputRef = useRef(null);
  const previewUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : ''),
    [photo],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: details.clientName,
      clientRole: details.clientRole,
      company: details.company,
      quote: '',
      sourceUrl: '',
      permissionConfirmed: false,
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const submit = useMutation({
    mutationFn: (values) => {
      const body = new FormData();
      Object.entries(values).forEach(([name, value]) => {
        body.append(name, String(value));
      });
      if (photo) body.append('photo', photo);

      return apiRequest(`/public/testimonial-requests/${token}`, {
        method: 'POST',
        body,
      });
    },
  });

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Choose an image smaller than 5 MB.');
      return;
    }

    setPhotoError('');
    setPhoto(file);
  }

  if (submit.isSuccess) return <SubmissionSuccess />;

  return (
    <main className="min-h-screen bg-ivory px-5 py-12 sm:px-8">
      <Seo canonicalPath="/testimonial" description="Private testimonial submission form." noIndex title="Testimonial request" />
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Link className="font-display text-2xl font-semibold text-primary" to="/">
            Grace Nyambura
          </Link>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald">
            Private testimonial request
          </p>
          <h1 className="mt-8 text-balance font-display text-xl leading-[1.15] text-primary md:text-2xl lg:text-3xl">
            Would you share what it was like working together?
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-muted">
            Your honest perspective helps other founders understand what the
            partnership is like. I will review your words and image before
            anything appears publicly.
          </p>
        </div>

        <form
          className="mt-10 grid gap-6 border border-border bg-white p-5 shadow-[0_18px_60px_rgba(27,34,56,0.06)] sm:p-8"
          onSubmit={form.handleSubmit((values) => submit.mutate(values))}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Your name" name="clientName" form={form} />
            <Field label="Your role" name="clientRole" form={form} />
            <div className="sm:col-span-2">
              <Field label="Company" name="company" form={form} />
            </div>
          </div>

          <ClientImageUpload
            error={photoError}
            inputRef={inputRef}
            onChange={selectPhoto}
            onRemove={() => setPhoto(null)}
            previewUrl={previewUrl}
          />

          <label className="text-sm font-semibold text-primary">
            Your testimonial
            <textarea
              className="mt-2 min-h-52 w-full resize-y border border-border p-3 font-normal leading-7 outline-none focus:border-emerald"
              placeholder="What changed, what stood out, or what would you tell another founder considering working with me?"
              {...form.register('quote')}
            />
            {form.formState.errors.quote && (
              <span className="mt-2 block font-normal text-red-700">
                {form.formState.errors.quote.message}
              </span>
            )}
          </label>

          <Field
            label="LinkedIn profile or source URL (optional)"
            name="sourceUrl"
            form={form}
            type="url"
          />

          <label className="flex gap-3 border border-border bg-ivory p-4 text-sm leading-6 text-body">
            <input
              className="mt-1 h-4 w-4 shrink-0 accent-emerald"
              type="checkbox"
              {...form.register('permissionConfirmed')}
            />
            <span>
              I confirm that this testimonial and uploaded image or logo may be
              published on the website and professional marketing channels.
            </span>
          </label>
          {form.formState.errors.permissionConfirmed && (
            <p className="text-sm text-red-700">
              {form.formState.errors.permissionConfirmed.message}
            </p>
          )}

          {submit.error && (
            <div
              className="border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-800"
              role="alert"
            >
              {submit.error.message}
            </div>
          )}

          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-bold text-white disabled:opacity-60"
            disabled={submit.isPending}
          >
            {submit.isPending && <LoaderCircle className="animate-spin" size={18} />}
            {submit.isPending ? 'Sending…' : 'Submit testimonial'}
          </button>
          <p className="flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck size={14} /> This link is private and can be submitted once.
          </p>
        </form>
      </div>
    </main>
  );
}

function ClientImageUpload({ error, inputRef, onChange, onRemove, previewUrl }) {
  return (
    <div>
      <p className="text-sm font-semibold text-primary">
        Your photo or company logo <span className="font-normal text-muted">(optional)</span>
      </p>
      <div className="mt-2 flex flex-col gap-4 border border-border bg-ivory p-4 sm:flex-row sm:items-center">
        {previewUrl ? (
          <img
            className="h-24 w-24 rounded-full bg-white object-cover"
            src={previewUrl}
            alt="Selected testimonial preview"
          />
        ) : (
          <span className="grid h-24 w-24 place-items-center rounded-full bg-white text-muted">
            <ImagePlus size={25} />
          </span>
        )}
        <div>
          <button
            className="inline-flex min-h-10 items-center gap-2 border border-primary bg-white px-4 text-sm font-bold text-primary"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus size={16} />
            {previewUrl ? 'Choose another image' : 'Upload photo or logo'}
          </button>
          {previewUrl && (
            <button
              className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-700"
              type="button"
              onClick={onRemove}
            >
              <Trash2 size={15} /> Remove image
            </button>
          )}
          <p className="mt-2 text-xs leading-5 text-muted">
            JPEG, PNG, or WebP. Maximum 5 MB.
          </p>
          <input
            className="sr-only"
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function Field({ form, label, name, type = 'text' }) {
  const error = form.formState.errors[name];
  return (
    <label className="text-sm font-semibold text-primary">
      {label}
      <input
        className={`mt-2 min-h-11 w-full border px-3 font-normal outline-none focus:border-emerald ${
          error ? 'border-red-600' : 'border-border'
        }`}
        type={type}
        {...form.register(name)}
      />
      {error && (
        <span className="mt-2 block font-normal text-red-700">{error.message}</span>
      )}
    </label>
  );
}

function SubmissionSuccess() {
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-5">
      <div className="max-w-xl text-center">
        <CheckCircle2
          className="mx-auto text-emerald"
          size={48}
          strokeWidth={1.5}
        />
        <h1 className="mt-6 font-display text-xl text-primary md:text-2xl lg:text-3xl">
          Thank you for sharing your experience.
        </h1>
        <p className="mt-5 leading-8 text-muted">
          Your testimonial has been sent to me for review. This private link
          can no longer be used.
        </p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center border-b border-primary font-bold text-primary"
          to="/"
        >
          Visit my website
        </Link>
      </div>
    </main>
  );
}

function InvalidRequest() {
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-5 text-center">
      <div className="max-w-xl">
        <h1 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">
          This testimonial link is no longer available.
        </h1>
        <p className="mt-5 leading-8 text-muted">
          It may have expired or already been submitted. Please contact me if
          you need a new invitation.
        </p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center border-b border-primary font-bold text-primary"
          to="/"
        >
          Visit the website
        </Link>
      </div>
    </main>
  );
}

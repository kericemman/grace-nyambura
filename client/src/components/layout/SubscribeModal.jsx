import { zodResolver } from '@hookform/resolvers/zod';
import { Check, LoaderCircle, Mail, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '../../lib/api';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  website: z.string(),
});

export function SubscribeModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [startedAt] = useState(() => Date.now());
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', website: '' },
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  async function subscribe(values) {
    setServerError('');
    try {
      await apiRequest('/public/subscribers', {
        method: 'POST',
        body: JSON.stringify({ ...values, startedAt }),
      });
      setSubmitted(true);
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-primary/65 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="relative w-full max-w-lg border border-white/20 bg-white p-6 shadow-2xl sm:p-9"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-title"
      >
        <button
          className="absolute top-4 right-4 grid h-10 w-10 place-items-center text-muted hover:text-primary"
          type="button"
          onClick={onClose}
          aria-label="Close subscription form"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald text-white">
              <Check size={24} />
            </span>
            <h2 id="subscribe-title" className="mt-6 font-display text-xl text-primary md:text-2xl lg:text-3xl">
              You&apos;re on the list.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Thank you for subscribing. My latest insights will arrive in your inbox.
            </p>
            <button className="mt-7 min-h-11 bg-primary px-6 text-sm font-bold text-white" type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="grid h-12 w-12 place-items-center bg-ivory text-emerald">
              <Mail size={21} />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-emerald">
              Join the mailing list
            </p>
            <h2 id="subscribe-title" className="mt-3 max-w-md font-display text-xl text-primary md:text-2xl lg:text-3xl">
              Thoughtful ideas on visibility and founder authority.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Receive my latest articles and practical LinkedIn perspectives by email.
            </p>

            <form className="mt-7 grid gap-5" onSubmit={form.handleSubmit(subscribe)} noValidate>
              <Field form={form} label="Your name" name="name" autoFocus />
              <Field form={form} label="Email address" name="email" type="email" />
              <input className="hidden" tabIndex="-1" autoComplete="off" {...form.register('website')} />
              {serverError && (
                <div className="border-l-2 border-red-700 bg-red-50 p-3 text-sm text-red-800" role="alert">
                  {serverError}
                </div>
              )}
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-bold text-white disabled:opacity-60"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting && <LoaderCircle className="animate-spin" size={17} />}
                {form.formState.isSubmitting ? 'Subscribing…' : 'Subscribe'}
              </button>
              <p className="text-center text-xs leading-5 text-muted">
                No spam. Unsubscribe whenever you like.
              </p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function Field({ autoFocus = false, form, label, name, type = 'text' }) {
  const error = form.formState.errors[name];
  return (
    <label className="text-sm font-semibold text-primary">
      {label}
      <input
        className={`mt-2 min-h-12 w-full border bg-white px-4 font-normal outline-none focus:border-emerald ${error ? 'border-red-600' : 'border-border'}`}
        autoFocus={autoFocus}
        type={type}
        {...form.register(name)}
      />
      {error && <span className="mt-2 block font-normal text-red-700">{error.message}</span>}
    </label>
  );
}

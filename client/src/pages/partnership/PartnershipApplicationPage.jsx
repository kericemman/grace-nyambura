import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Send } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { apiRequest } from '../../lib/api';
import { useEffect } from 'react';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid business email.'),
  phone: z.string().min(1, 'Enter your phone number.').refine(
    isValidPhoneNumber,
    'Enter a valid phone number.',
  ),
  company: z.string().trim().min(2, 'Enter your company name.'),
  professionalRole: z.string().trim().min(2, 'Enter your professional role.'),
  linkedInUrl: z.union([
    z.literal(''),
    z.string().url('Enter a complete URL, including https://'),
  ]),
  primaryGoal: z.string().min(1, 'Choose your primary goal.'),
  currentPostingRhythm: z.string().min(1, 'Choose your current posting rhythm.'),
  desiredStart: z.string().min(1, 'Choose when you would like to start.'),
  additionalContext: z.string().max(3000),
  consent: z.literal(true, { error: 'Please confirm that I may contact you.' }),
  website: z.string(),
});

const inputClass = 'mt-2 min-h-12 w-full border border-border bg-white px-4 text-primary outline-none transition focus:border-emerald';

export function PartnershipApplicationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [startedAt] = useState(() => Date.now());
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      professionalRole: '',
      linkedInUrl: '',
      primaryGoal: '',
      currentPostingRhythm: '',
      desiredStart: '',
      additionalContext: '',
      consent: false,
      website: '',
    },
  });

  async function submit(values) {
    setServerError('');
    try {
      await apiRequest('/public/partnership-applications', {
        method: 'POST',
        body: JSON.stringify({ ...values, startedAt }),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setServerError(error.message);
    }
  }

  if (submitted) return <SuccessState />;

  return (
    <div className="bg-ivory">
      <header className="bg-primary px-4 py-14 text-white md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">
            LinkedIn Content Partnership
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-xl leading-tight md:text-2xl lg:text-3xl">
            Tell me where your LinkedIn presence needs to go next.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/70">
            Share a little about your business, your current content rhythm, and
            what you want the partnership to help you achieve.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-[min(100%-2rem,72rem)] gap-10 py-12 lg:grid-cols-[0.72fr_1.28fr] lg:py-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">
            Before you apply
          </p>
          <h2 className="mt-4 font-display text-xl text-primary md:text-2xl lg:text-3xl">
            A close, ongoing content partnership.
          </h2>
          <p className="mt-5 leading-8 text-muted">
            This offer is designed for founders and executives who want strategic,
            consistent LinkedIn content without losing their voice.
          </p>
          <ul className="mt-7 grid gap-4">
            {[
              'Founder voice discovery and content strategy',
              'Ghostwriting, review, scheduling, and publishing',
              'A minimum three-month engagement',
            ].map((item) => (
              <li className="flex gap-3 text-sm leading-6 text-body" key={item}>
                <Check className="mt-1 shrink-0 text-emerald" size={16} /> {item}
              </li>
            ))}
          </ul>
        </aside>

        <form
          className="border border-border bg-white p-5 shadow-[0_24px_70px_rgba(27,34,56,0.07)] sm:p-8 lg:p-10"
          noValidate
          onSubmit={form.handleSubmit(submit)}
        >
          <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">
            Partnership application
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            I review every application personally.
          </p>

          {serverError && (
            <div className="mt-6 border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-800" role="alert">
              {serverError}
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Field form={form} label="Full name" name="fullName" />
            <Field form={form} label="Business email" name="email" type="email" />
            <PhoneField form={form} />
            <Field form={form} label="Company" name="company" />
            <Field form={form} label="Professional role" name="professionalRole" />
            <Field form={form} label="LinkedIn profile" name="linkedInUrl" type="url" />
            <SelectField
              form={form}
              label="Primary LinkedIn goal"
              name="primaryGoal"
              options={['Build founder authority', 'Generate qualified conversations', 'Strengthen brand visibility', 'Create a consistent content presence']}
            />
            <SelectField
              form={form}
              label="Current posting rhythm"
              name="currentPostingRhythm"
              options={['Not posting currently', 'Occasionally', 'Once or twice a week', 'Three or more times a week']}
            />
            <div className="sm:col-span-2">
              <SelectField
                form={form}
                label="When would you like to start?"
                name="desiredStart"
                options={['As soon as possible', 'Within one month', 'Within three months', 'I am exploring for later']}
              />
            </div>
            <label className="sm:col-span-2 text-sm font-semibold text-primary">
              Anything else I should know? <span className="font-normal text-muted">(optional)</span>
              <textarea
                className={`${inputClass} min-h-36 py-3`}
                placeholder="Share your current challenge, audience, or what success would look like."
                {...form.register('additionalContext')}
              />
            </label>
            <input className="hidden" tabIndex="-1" autoComplete="off" {...form.register('website')} />
            <label className="sm:col-span-2 flex gap-3 border border-border bg-ivory p-4 text-sm leading-6 text-body">
              <input className="mt-1 h-4 w-4 shrink-0 accent-emerald" type="checkbox" {...form.register('consent')} />
              <span>I agree that my details may be used to review my application and contact me about the partnership.</span>
            </label>
            {form.formState.errors.consent && (
              <p className="sm:col-span-2 text-sm text-red-700">{form.formState.errors.consent.message}</p>
            )}
          </div>

          <button
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 font-bold text-white disabled:opacity-60"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting…' : 'Submit application'}
            <Send size={17} />
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({ form, label, name, type = 'text' }) {
  const error = form.formState.errors[name];
  return (
    <label className="text-sm font-semibold text-primary">
      {label}
      <input className={inputClass} type={type} {...form.register(name)} />
      {error && <span className="mt-2 block font-normal text-red-700">{error.message}</span>}
    </label>
  );
}

function PhoneField({ form }) {
  const error = form.formState.errors.phone;
  return (
    <label className="text-sm font-semibold text-primary">
      Phone number
      <Controller
        control={form.control}
        name="phone"
        render={({ field }) => (
          <PhoneInput
            className={`${inputClass} partnership-phone-input`}
            defaultCountry="KE"
            international
            countryCallingCodeEditable={false}
            value={field.value}
            onChange={(value) => field.onChange(value ?? '')}
          />
        )}
      />
      {error && <span className="mt-2 block font-normal text-red-700">{error.message}</span>}
    </label>
  );
}

function SelectField({ form, label, name, options }) {
  const error = form.formState.errors[name];
  return (
    <label className="text-sm font-semibold text-primary">
      {label}
      <select className={inputClass} {...form.register(name)}>
        <option value="">Select an option</option>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
      {error && <span className="mt-2 block font-normal text-red-700">{error.message}</span>}
    </label>
  );
}

function SuccessState() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-ivory px-5 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald text-white">
          <Check size={28} />
        </span>
        <h1 className="mt-6 font-display text-xl text-primary md:text-2xl lg:text-3xl">
          Your application has been received.
        </h1>
        <p className="mt-5 leading-8 text-muted">
          I will review what you shared and contact you about the next step.
        </p>
        <Link className="mt-8 inline-flex min-h-11 items-center border-b border-primary font-bold text-primary" to="/">
          Return to the homepage
        </Link>
      </div>
    </main>
  );
}

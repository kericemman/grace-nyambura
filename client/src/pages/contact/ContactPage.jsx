import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Check, Clock3, Linkedin, Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import { useSiteSettings } from '../../components/layout/SiteSettingsContext';
import { apiRequest } from '../../lib/api';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Please enter a valid business email'),
  phone: z
    .string()
    .min(1, 'Please enter your phone number')
    .refine(isValidPhoneNumber, 'Please enter a valid phone number'),
  company: z.string().trim().min(2, 'Please enter your company name'),
  websiteUrl: z.union([z.literal(''), z.string().url('Please enter a complete URL, including https://')]),
  professionalRole: z.string().trim().min(2, 'Please enter your professional role'),
  primaryChallenge: z.string().min(1, 'Please choose your primary LinkedIn challenge'),
  projectDescription: z.string().trim().min(20, 'Please share a little more so I can prepare well'),
  preferredContactMethod: z.enum(['email', 'phone', 'linkedin']),
  consent: z.literal(true, { error: 'Please confirm that I may contact you' }),
  website: z.string(),
});

const fieldClass = [
  'mt-2 min-h-12 w-full border border-border bg-white px-4 text-base',
  'text-primary outline-none transition placeholder:text-muted/65',
  'hover:border-primary/40 focus:border-emerald',
].join(' ');

const bookingLinkClass = [
  'mt-8 inline-flex min-h-12 items-center gap-2 border border-primary px-4',
  'text-sm font-bold text-primary transition hover:bg-primary hover:text-white',
].join(' ');

const submitButtonClass = [
  'mt-8 inline-flex min-h-13 w-full items-center justify-center gap-2',
  'bg-primary px-6 font-bold text-white transition hover:bg-[#29324f]',
  'disabled:cursor-wait disabled:opacity-65 sm:w-auto',
].join(' ');

const contactMethodClass = [
  'cursor-pointer border border-border px-4 py-3 text-sm font-semibold text-primary',
  'has-[:checked]:border-emerald has-[:checked]:bg-emerald/8',
].join(' ');

export function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const settings = useSiteSettings();
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
      websiteUrl: '',
      professionalRole: '',
      primaryChallenge: '',
      projectDescription: '',
      preferredContactMethod: 'email',
      consent: false,
      website: '',
    },
  });

  async function submit(values) {
    setServerError('');
    try {
      await apiRequest('/public/enquiries', {
        method: 'POST',
        body: JSON.stringify({ ...values, startedAt }),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setServerError(error.message);
      requestAnimationFrame(() => document.getElementById('contact-error')?.focus());
    }
  }

  if (submitted) return <SuccessPanel settings={settings} />;

  return (
    <div className="bg-ivory">
      <section className="relative overflow-hidden border-b border-border bg-primary text-white">
        <div
          className="absolute -top-36 right-[-8rem] h-96 w-96 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute top-14 right-10 h-52 w-52 rounded-full bg-emerald/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-[min(100%-2rem,76rem)] gap-10 py-16 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">
              Start a conversation
            </p>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-xl leading-[1.15] md:text-2xl lg:text-3xl">
              Let&apos;s explore what a stronger LinkedIn presence could look like for you.
            </h1>
          </div>
         
        </div>
      </section>

      <section className="mx-auto grid w-[min(100%-2rem,76rem)] gap-8 py-14 md:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">
            What happens next
          </p>
          <h2 className="mt-4 font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">
            A thoughtful first conversation.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            Tell me a little about your business and what you&apos;re hoping to achieve.
            We&apos;ll use the conversation to explore whether the LinkedIn Content
            Partnership is the right fit.
          </p>
          <div className="mt-8 space-y-5 border-l border-champagne pl-5">
            <Info
              icon={Clock3}
              title="A reply soon"
              copy="I will review your goals and respond personally."
            />
            <Info
              icon={Mail}
              title="No mailing list"
              copy="Your details are used only to respond to this enquiry."
            />
          </div>

          <ContactDetails settings={settings} />

          {settings.calendlyUrl && (
            <a
              className={bookingLinkClass}
              href={settings.calendlyUrl}
              target="_blank"
              rel="noreferrer"
            >
              Prefer to book directly?
              <ArrowUpRight size={16} />
            </a>
          )}
        </aside>

        <form
          className="border border-border bg-white p-5 shadow-[0_24px_70px_rgba(27,34,56,0.07)] sm:p-8 lg:p-10"
          noValidate
          onSubmit={form.handleSubmit(submit)}
        >
          <FormHeading />
          {serverError && <ServerError message={serverError} />}
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <Field form={form} label="Full name" name="fullName" required />
            <Field form={form} label="Business email" name="email" type="email" required />
            <PhoneField form={form} />
            <Field form={form} label="Company name" name="company" required />
            <Field form={form} label="Professional role" name="professionalRole" required />
            <div className="sm:col-span-2">
              <Field
                form={form}
                label="Website or LinkedIn URL"
                name="websiteUrl"
                type="url"
                placeholder="https://"
              />
            </div>
            <ChallengeField form={form} />
            <ProjectField form={form} />
            <ContactMethodField form={form} />
            <SpamField form={form} />
            <ConsentField form={form} />
          </div>
          <button
            className={submitButtonClass}
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? 'Sending…' : 'Send enquiry'}
            <Send size={17} aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  );
}

function ContactDetails({ settings }) {
  return (
    <div className="mt-9 hidden border-y border-border py-6 lg:block">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
        Contact me directly
      </p>
      <div className="mt-4 grid gap-3">
        {settings.businessEmail && (
          <ContactLink
            href={`mailto:${settings.businessEmail}`}
            icon={Mail}
            label="Email"
            value={settings.businessEmail}
          />
        )}
        {settings.phone && (
          <ContactLink
            href={`tel:${settings.phone.replace(/\s/g, '')}`}
            icon={Phone}
            label="Phone"
            value={settings.phone}
          />
        )}
        {settings.linkedInUrl && (
          <ContactLink
            href={settings.linkedInUrl}
            icon={Linkedin}
            label="LinkedIn"
            value="Connect with me"
            external
          />
        )}
      </div>
    </div>
  );
}

function ContactLink({ external = false, href, icon: Icon, label, value }) {
  return (
    <a
      className="group flex items-center gap-3 text-sm text-muted transition hover:text-primary"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center bg-white text-emerald">
        <Icon size={16} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs font-bold uppercase tracking-wider text-muted">
          {label}
        </span>
        <span className="mt-0.5 block break-all font-semibold text-primary group-hover:text-emerald">
          {value}
        </span>
      </span>
    </a>
  );
}

function FormHeading() {
  return (
    <div className="border-b border-border pb-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
        Your details
      </p>
      <h2 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
        Tell me about your goals.
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Fields marked with an asterisk are required.
      </p>
    </div>
  );
}

function ServerError({ message }) {
  return (
    <div
      className="mt-6 border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-800"
      id="contact-error"
      role="alert"
      tabIndex="-1"
    >
      <strong>We couldn&apos;t send your enquiry.</strong>
      <br />
      {message} Your answers are still here.
    </div>
  );
}

function ChallengeField({ form }) {
  const error = form.formState.errors.primaryChallenge;

  return (
    <label className="text-sm font-semibold text-primary sm:col-span-2">
      Primary LinkedIn challenge <span aria-hidden="true">*</span>
      <select
        className={fieldClass}
        {...form.register('primaryChallenge')}
        aria-invalid={Boolean(error)}
      >
        <option value="">Choose the closest match</option>
        <option>Finding time to create consistently</option>
        <option>Turning expertise into clear content</option>
        <option>Building visibility with the right audience</option>
        <option>Writing in an authentic voice</option>
        <option>Creating a practical content strategy</option>
        <option>Something else</option>
      </select>
      <ErrorMessage error={error} />
    </label>
  );
}

function ProjectField({ form }) {
  const error = form.formState.errors.projectDescription;

  return (
    <label className="text-sm font-semibold text-primary sm:col-span-2">
      Brief project description <span aria-hidden="true">*</span>
      <textarea
        className={`${fieldClass} min-h-40 resize-y py-3`}
        {...form.register('projectDescription')}
        aria-invalid={Boolean(error)}
        placeholder="What are you hoping to change or achieve through LinkedIn?"
      />
      <ErrorMessage error={error} />
    </label>
  );
}

function ContactMethodField({ form }) {
  const methods = [
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['linkedin', 'LinkedIn'],
  ];

  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-sm font-semibold text-primary">
        How would you prefer me to contact you?
      </legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {methods.map(([value, label]) => (
          <label
            className={contactMethodClass}
            key={value}
          >
            <input
              className="mr-2 accent-emerald"
              type="radio"
              value={value}
              {...form.register('preferredContactMethod')}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SpamField({ form }) {
  return (
    <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
      <label>
        Website
        <input tabIndex="-1" autoComplete="off" {...form.register('website')} />
      </label>
    </div>
  );
}

function ConsentField({ form }) {
  return (
    <label className="flex items-start gap-3 border-t border-border pt-6 text-sm leading-6 text-muted sm:col-span-2">
      <input
        className="mt-1 h-5 w-5 shrink-0 accent-emerald"
        type="checkbox"
        {...form.register('consent')}
      />
      <span>
        I agree that my details may be used to respond to my enquiry.{' '}
        <span aria-hidden="true">*</span>
        <ErrorMessage error={form.formState.errors.consent} />
      </span>
    </label>
  );
}

function PhoneField({ form }) {
  const error = form.formState.errors.phone;

  return (
    <label className="text-sm font-semibold text-primary">
      Phone number <span aria-hidden="true">*</span>
      <Controller
        control={form.control}
        name="phone"
        render={({ field }) => (
          <PhoneInput
            className="mt-2 min-h-12 border border-border bg-white px-4 text-base text-primary transition hover:border-primary/40 focus-within:border-emerald [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputInput]:min-h-11 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none"
            defaultCountry="KE"
            international
            countryCallingCodeEditable={false}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(value) => field.onChange(value ?? '')}
            aria-label="Phone number"
          />
        )}
      />
      <ErrorMessage error={error} />
    </label>
  );
}

function Field({ form, label, name, required, type = 'text', placeholder }) {
  const error = form.formState.errors[name];

  return (
    <label className="text-sm font-semibold text-primary">
      {label} {required && <span aria-hidden="true">*</span>}
      <input
        className={fieldClass}
        type={type}
        placeholder={placeholder}
        {...form.register(name)}
        aria-invalid={Boolean(error)}
      />
      <ErrorMessage error={error} />
    </label>
  );
}

function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <span className="mt-2 block text-sm font-medium text-red-700" role="alert">
      {error.message}
    </span>
  );
}

function Info({ icon: Icon, title, copy }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-1 shrink-0 text-emerald" size={18} aria-hidden="true" />
      <div>
        <p className="font-semibold text-primary">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{copy}</p>
      </div>
    </div>
  );
}

function SuccessPanel({ settings }) {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-white px-4 py-20 text-white">
      <div
        className="w-full max-w-2xl border border-white/15 bg-primary p-8 text-center shadow-2xl backdrop-blur-sm sm:p-12"
        role="status"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-champagne text-primary">
          <Check size={25} />
        </span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-champagne">
          Enquiry received
        </p>
        <h1 className="mt-4 font-display text-xl md:text-2xl lg:text-3xl">
          Thank you for reaching out.
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-8 text-white/75">
          I have received your enquiry and will review it personally. You&apos;ll hear
          back soon using your preferred contact method.
        </p>

        <Link to="/" className="mt-8 inline-flex min-h-12 items-center gap-2 border border-white/40 px-4 text-sm font-bold text-white transition hover:bg-white/10">
          Return to the home page
          <ArrowUpRight size={16} />
        </Link>
        {settings.calendlyUrl && (
          <a
            className="mt-8 inline-flex min-h-12 items-center gap-2 bg-white px-5 text-sm font-bold text-primary"
            href={settings.calendlyUrl}
            target="_blank"
            rel="noreferrer"
          >
            Book a discovery call
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}

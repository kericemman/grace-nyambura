import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Information I collect',
    content: (
      <>
        <p>I collect information you choose to provide through this website, including:</p>
        <ul>
          <li>your name, email address, phone number, company, professional role, and profile or website links;</li>
          <li>information submitted through contact and LinkedIn Partnership application forms;</li>
          <li>testimonial text, client photos or logos, and publication permission;</li>
          <li>your name and email address when you join the mailing list; and</li>
          <li>administrative and technical records needed to keep the website secure and functioning.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'How I use your information',
    content: (
      <>
        <p>I use personal information to:</p>
        <ul>
          <li>respond to enquiries and assess partnership applications;</li>
          <li>provide, plan, and administer agreed services;</li>
          <li>review and publish testimonials where permission has been given;</li>
          <li>send requested articles or mailing-list updates;</li>
          <li>maintain the website, prevent misuse, and protect its security; and</li>
          <li>meet legal, accounting, or regulatory obligations.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Lawful use and consent',
    content: (
      <p>
        I process information when you have given consent, when it is necessary to respond to your request or perform an agreement, when there is a legitimate business reason that does not override your rights, or when the law requires it. You may withdraw mailing-list or testimonial consent at any time. Withdrawal does not affect processing that was lawful before it was withdrawn.
      </p>
    ),
  },
  {
    title: 'How information is shared',
    content: (
      <p>
        I do not sell personal information. Information may be handled by trusted providers that support website hosting, database storage, image hosting, email delivery, security, or professional administration. These providers receive only the information reasonably needed for their role. Information may also be disclosed when required by law or necessary to protect legal rights and website security.
      </p>
    ),
  },
  {
    title: 'International processing',
    content: (
      <p>
        Some technology providers may process or store information outside Kenya. Where this occurs, I take reasonable steps to use providers and safeguards intended to protect personal information in line with applicable data-protection requirements.
      </p>
    ),
  },
  {
    title: 'Cookies and technical information',
    content: (
      <p>
        The website may use essential cookies or similar storage for secure administrator sessions and core website functions. If analytics or other non-essential tracking is introduced, this policy and any required consent controls will be updated before that tracking is used.
      </p>
    ),
  },
  {
    title: 'Retention and security',
    content: (
      <p>
        I retain information only for as long as reasonably needed for the purpose for which it was collected, ongoing business records, dispute resolution, security, and legal obligations. Reasonable technical and organisational safeguards are used, but no online system can guarantee absolute security.
      </p>
    ),
  },
  {
    title: 'Your data-protection rights',
    content: (
      <>
        <p>
          Subject to applicable law, you may ask to be informed about how your data is used, access it, object to or restrict certain processing, correct inaccurate information, or request deletion. You may also unsubscribe from marketing messages at any time.
        </p>
        <p>
          Kenya&apos;s Office of the Data Protection Commissioner provides more information about data-subject rights and complaints at{' '}
          <a href="https://www.odpc.go.ke/rights-of-a-data-subject/" target="_blank" rel="noreferrer">odpc.go.ke</a>.
        </p>
      </>
    ),
  },
  {
    title: 'Children',
    content: (
      <p>
        This website and its professional services are not directed to children. I do not knowingly request personal information from children through the public forms.
      </p>
    ),
  },
  {
    title: 'Updates to this policy',
    content: (
      <p>
        This policy may be updated when website practices, services, or legal requirements change. The current version and effective date will remain available on this page.
      </p>
    ),
  },
];

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains how I collect, use, store, and protect personal information provided through this website."
    >
      {sections.map((section) => (
        <PolicySection key={section.title} title={section.title}>
          {section.content}
        </PolicySection>
      ))}
      <PolicySection title="Contact">
        <p>
          To ask a privacy question or exercise a data-protection right, email{' '}
          <a href="mailto:hello@gracenyambura.com">hello@gracenyambura.com</a>.
          Please provide enough detail to identify your request. Reasonable identity verification may be required before personal information is disclosed or changed.
        </p>
      </PolicySection>
    </LegalPage>
  );
}

function LegalPage({ children, eyebrow, intro, title }) {
  return (
    <div className="bg-white">
      <header className="bg-primary px-4 py-14 text-white md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">{eyebrow}</p>
          <h1 className="mt-5 font-display text-xl md:text-2xl lg:text-3xl">{title}</h1>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">{intro}</p>
          <p className="mt-5 text-sm text-white/50">Effective: 21 October 2026</p>
        </div>
      </header>
      <main className="mx-auto grid w-[min(100%-2rem,68rem)] gap-10 py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:py-20">
        <aside className="self-start border-l-2 border-champagne pl-5 lg:sticky lg:top-28">
          <p className="text-sm font-semibold text-primary">Grace Nyambura</p>
          <p className="mt-2 text-sm leading-6 text-muted">LinkedIn Content Partner<br />Nairobi, Kenya</p>
          <Link className="mt-5 inline-flex text-sm font-bold text-emerald" to="/contact">Contact me</Link>
        </aside>
        <article className="legal-copy min-w-0 space-y-12">{children}</article>
      </main>
    </div>
  );
}

function PolicySection({ children, title }) {
  return (
    <section>
      <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 leading-8 text-muted [&_a]:font-semibold [&_a]:text-emerald [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const sections = [
  ['Using this website', 'You may use this website for lawful personal and business-information purposes. You must not interfere with the website, attempt unauthorised access, submit malicious material, scrape it in a way that disrupts service, impersonate another person, or use its forms for spam or unlawful activity.'],
  ['Information and availability', 'Website content is provided for general information. I aim to keep it accurate and useful, but I do not promise that every page will always be complete, current, uninterrupted, or error-free. Content may be corrected, updated, suspended, or removed without notice.'],
  ['Enquiries and partnership applications', 'Submitting an enquiry or LinkedIn Partnership application does not create a client relationship, guarantee availability, or require either party to proceed. A service relationship begins only when the parties accept a separate written proposal or agreement covering scope, timing, fees, payment, revisions, confidentiality, intellectual property, and termination.'],
  ['Bookings, fees, and services', 'Prices shown on the website are starting points unless expressly stated otherwise. Final fees, deliverables, schedules, payment terms, and any minimum engagement will be confirmed in a separate written agreement. If a separate agreement conflicts with these website terms on the delivery of paid services, the separate agreement controls.'],
  ['Testimonials and client materials', 'When you submit a testimonial, photo, logo, link, or other material and confirm publication permission, you represent that you have the right to provide it and grant me permission to review, edit for clarity without changing its meaning, and publish it on the website or professional marketing channels. You may withdraw permission for future use by contacting me, subject to reasonable time needed to remove material from controlled channels.'],
  ['Mailing list', 'You may join my mailing list voluntarily. Messages may include new articles, professional insights, or service updates. You may unsubscribe at any time using an available unsubscribe method or by contacting me. You must not subscribe another person without their permission.'],
  ['Intellectual property', 'Unless otherwise stated, I own the website design, written content, branding, graphics, and original materials, or use them with permission. You may read, link to, and share short attributed excerpts for lawful non-commercial purposes. You may not reproduce, republish, sell, modify, or commercially exploit substantial website content without prior written permission.'],
  ['Third-party services and links', 'The website may link to LinkedIn, social platforms, scheduling tools, payment providers, or other third-party services. Those services operate under their own terms and privacy practices. I am not responsible for their availability, security, content, or actions.'],
  ['Professional disclaimer', 'Website articles and resources reflect general communication, content, and professional visibility perspectives. They are not legal, financial, tax, medical, or other regulated professional advice. Results depend on many factors, and no specific business, audience, lead-generation, revenue, ranking, or platform result is guaranteed.'],
  ['Limitation of responsibility', 'To the extent permitted by applicable law, I am not responsible for indirect, incidental, special, or consequential loss arising solely from use of, inability to use, or reliance on this public website. Nothing in these terms excludes responsibility that cannot lawfully be excluded.'],
  ['Privacy', 'Personal information submitted through the website is handled as described in the Privacy Policy.'],
  ['Changes and termination', 'These terms may be updated when the website, services, or legal requirements change. The current version and effective date will be posted here. Access may be restricted or terminated where these terms, website security, or applicable law are violated.'],
  ['Governing law', 'These website terms are governed by the laws of Kenya. The parties should first try to resolve any concern in good faith. Any unresolved dispute relating to these website terms will be handled by the courts or other competent dispute-resolution forums in Kenya, subject to applicable law.'],
];

export function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <header className="bg-primary px-4 py-14 text-white md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">Legal</p>
          <h1 className="mt-5 font-display text-xl md:text-2xl lg:text-3xl">Terms of Service</h1>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">
            These terms govern use of my public website and its forms. Paid client work is governed by a separate written service agreement.
          </p>
          <p className="mt-5 text-sm text-white/50">Effective: 21 October 2026</p>
        </div>
      </header>

      <main className="mx-auto grid w-[min(100%-2rem,68rem)] gap-10 py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:py-20">
        <aside className="self-start border-l-2 border-champagne pl-5 lg:sticky lg:top-28">
          <p className="text-sm font-semibold text-primary">Website terms</p>
          <p className="mt-2 text-sm leading-6 text-muted">Please read these terms before using the website or submitting a form.</p>
          <Link className="mt-5 inline-flex text-sm font-bold text-emerald" to="/privacy-policy">Read the Privacy Policy</Link>
        </aside>

        <article className="min-w-0 space-y-12">
          <section>
            <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Acceptance</h2>
            <p className="mt-5 leading-8 text-muted">
              By using this website, you agree to these terms. If you do not agree, please stop using the website. You must have legal capacity to submit information or enter into an agreement.
            </p>
          </section>
          {sections.map(([title, copy]) => (
            <section key={title}>
              <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h2>
              <p className="mt-5 leading-8 text-muted">{copy}</p>
            </section>
          ))}
          <section>
            <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Contact</h2>
            <p className="mt-5 leading-8 text-muted">
              Questions about these terms may be sent to{' '}
              <a className="font-semibold text-emerald underline" href="mailto:hello@gracenyambura.com">hello@gracenyambura.com</a>.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}

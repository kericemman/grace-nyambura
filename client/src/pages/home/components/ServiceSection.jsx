import { Check } from 'lucide-react';
import { ButtonLink } from '../../../components/ui/ButtonLink';
import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { serviceInclusions } from '../homeContent';
import { useSiteSettings } from '../../../components/layout/SiteSettingsContext';

export function ServiceSection() {
  const settings = useSiteSettings();
  return (
    <section className="bg-primary px-4 py-10 md:py-16 text-white">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="grid items-end gap-9 border-b border-white/15 pb-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading eyebrow="The signature partnership" tone="light">One partnership. A complete approach to your LinkedIn content.</SectionHeading>
          {/* <p className="max-w-2xl leading-8 text-white/70 lg:justify-self-end">A close, ongoing collaboration that turns what you know into thoughtful content—and keeps the entire publishing process moving.</p> */}
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <Reveal>
            <h3 className="font-display text-xl md:text-2xl lg:text-3xl">LinkedIn Content Partnership</h3>
            <p className="mt-6 text-2xl font-semibold text-champagne">Starting at {settings.serviceStartingPrice}</p>
            <p className="mt-2 text-sm text-white/60">Minimum engagement: {settings.minimumEngagement}</p>
            <ButtonLink className="mt-8" to="/linkedin-partnership" variant="light">Apply for the Partnership</ButtonLink>
          </Reveal>
          <Reveal className="grid gap-x-10 sm:grid-cols-2" delay={0.06}>
            {serviceInclusions.map((item) => (
              <div className="flex min-h-14 items-center gap-3 border-b border-white/15 py-3" key={item}>
                <Check className="shrink-0 text-champagne" size={17} aria-hidden="true" />
                <span className="text-sm text-white/85">{item}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}


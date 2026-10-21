import { Quote } from 'lucide-react';
import { ButtonLink } from '../../../components/ui/ButtonLink';
import { Reveal } from '../../../components/ui/Reveal';
import { homeImages } from '../homeContent';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-5 md:py-16 before:absolute before:top-0 ">
      <div className="relative mx-auto grid w-[min(100%-1.5rem,78rem)] items-center gap-14 sm:w-[min(100%-2rem,78rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.72fr)] lg:gap-20">
        <Reveal className="relative z-[1]">
          <h1 className="mt-6 text-balance font-display text-2xl leading-[1.1] tracking-tight text-primary md:text-2xl lg:text-6xl">You have the expertise. Let&apos;s make sure the right people see it.</h1>
          <p className="mt-7 max-w-2xl text-sm leading-8 text-body/85 md:text-xl md:leading-9">I help B2B founders and executives turn their ideas, experiences, 
            and perspectives into LinkedIn content that sounds like them, builds credibility, and attracts meaningful business conversations.
          
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/contact">Book a Direct Call with Me</ButtonLink>
            <ButtonLink to="/linkedin-partnership" variant="secondary">Explore the Partnership</ButtonLink>
          </div>
          <p className="mt-7 border-l-2 border-champagne pl-4 text-sm font-medium leading-6 text-muted">Strategic LinkedIn content. Written in your voice. Managed consistently.</p>
        </Reveal>
        <Reveal className="relative mx-auto w-[min(100%,28rem)]" delay={0.08}>
          <div className="absolute -top-5 right-5 bottom-5 -left-5 border border-champagne" aria-hidden="true" />
          <figure className="relative aspect-[4/5] overflow-hidden bg-[#e5edf5]">
            <img className="h-full w-full object-cover object-[50%_42%]" src={homeImages.hero.src} srcSet={homeImages.hero.srcSet} sizes="(min-width: 1024px) 36vw, (min-width: 640px) 70vw, 92vw" width="800" height="1000" alt={homeImages.hero.alt} fetchPriority="high" />
          </figure>
          <p className="absolute right-[-0.25rem] bottom-4 z-[3] flex max-w-56 items-start gap-2 bg-primary px-4 py-3.5 font-display text-white sm:right-[-0.75rem] sm:bottom-9"><Quote size={17} aria-hidden="true" />Quiet authority begins with clarity.</p>
        </Reveal>
      </div>
    </section>
  );
}


import { ButtonLink } from '../../../components/ui/ButtonLink';
import { Reveal } from '../../../components/ui/Reveal';

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-champagne py-20 md:py-28">
      <div className="absolute top-1/2 left-1/2 aspect-square w-[min(42rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" aria-hidden="true" />
      <Reveal className="relative z-10 mx-auto w-[min(100%-2rem,56rem)] text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Ready when you are</p>
        <h2 className="mt-5 text-balance font-display text-xl leading-[1.1] tracking-tight text-primary md:text-2xl lg:text-3xl">You focus on building the business. I&apos;ll help communicate the value behind it.</h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-body">If you&apos;re a founder who wants a stronger LinkedIn presence without adding content creation to your already busy schedule, I&apos;d love to understand what you&apos;re building.</p>
        <ButtonLink className="mt-9" to="/contact">Let&apos;s Talk About Your LinkedIn Presence</ButtonLink>
      </Reveal>
    </section>
  );
}


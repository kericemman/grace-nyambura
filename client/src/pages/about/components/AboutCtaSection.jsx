import { ButtonLink } from '../../../components/ui/ButtonLink';
import { Reveal } from '../../../components/ui/Reveal';

export function AboutCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-white py-20 text-primary md:py-28">
      <div className="absolute top-1/2 right-[-12rem] aspect-square w-[34rem] -translate-y-1/2 rounded-full border border-champagne/50" aria-hidden="true" />
      <div className="absolute top-1/2 right-[-7rem] aspect-square w-[24rem] -translate-y-1/2 rounded-full border border-champagne/30" aria-hidden="true" />

      <Reveal className="relative mx-auto w-[min(100%-2rem,62rem)] text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">A thoughtful partnership</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-balance font-display text-lg md:text-xl leading-[1.1] lg:text-3xl">
          Your experience already holds the stories. Let&apos;s make them easier for the right people to see.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-sm md:text-base leading-8 text-muted">
          If you want a consistent LinkedIn presence without losing your voice, I&apos;d love to hear what you are
          building.
        </p>
        <ButtonLink className="mt-9" to="/contact" variant="primary">
          Book a Discovery Call
        </ButtonLink>
      </Reveal>
    </section>
  );
}

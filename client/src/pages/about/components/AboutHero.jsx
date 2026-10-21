import { ButtonLink } from '../../../components/ui/ButtonLink';
import { Reveal } from '../../../components/ui/Reveal';
import { aboutImages } from '../aboutContent';

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div className="absolute top-0 right-0 h-full w-1/3 bg-champagne/[0.09]" aria-hidden="true" />
      <div className="absolute top-16 left-0 h-px w-1/2 bg-gradient-to-r from-transparent to-champagne/30" aria-hidden="true" />

      <div className="relative mx-auto px-4 grid min-h-[42rem] w-[min(100%-1.5rem,78rem)] items-center gap-14 py-16 sm:w-[min(100%-2rem,78rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">About me</p>
          <h1 className="mt-6 max-w-3xl text-balance font-display text-lg leading-[1.1] tracking-tight md:text-2xl lg:text-3xl">
            I&apos;m Grace. I help founders put their expertise into words that connect.
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-8 text-white/70">
            Writer, listener, and LinkedIn Content Partner helping thoughtful business leaders become easier to
            understand, remember, and trust.
          </p>
          <ButtonLink className="mt-9" to="/contact" variant="light">
            Start a Conversation
          </ButtonLink>
        </Reveal>

        <Reveal className="relative mx-auto w-[min(100%,28rem)]" delay={0.07}>
          <div className="absolute -top-5 -right-5 h-2/3 w-2/3 border-t border-r border-champagne/70" aria-hidden="true" />
          <figure className="relative aspect-[4/5] overflow-hidden bg-white/10">
            <img
              className="h-full w-full object-cover object-[50%_42%]"
              src={aboutImages.hero.src}
              srcSet={aboutImages.hero.srcSet}
              sizes="(min-width: 1024px) 38vw, 90vw"
              width="900"
              height="1125"
              alt={aboutImages.hero.alt}
              fetchPriority="high"
            />
          </figure>
          <div className="absolute -bottom-5 -left-5 bg-emerald px-5 py-4 text-sm font-semibold tracking-wide text-white">
            Writing in your voice.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { ButtonLink } from '../../components/ui/ButtonLink';

export function UpcomingPage({ eyebrow, title }) {
  return (
    <section className="min-h-[62vh] bg-ivory py-section">
      <div className="mx-auto w-[min(100%-1.5rem,48rem)] text-center sm:w-[min(100%-2rem,48rem)]">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">{eyebrow}</p>
        <h1 className="mt-5 text-balance font-display text-xl leading-[1.1] text-primary md:text-2xl lg:text-3xl">{title}</h1>
        <p className="mx-auto mt-7 max-w-xl leading-8 text-muted">
          This page is part of the next implementation phase. The route is ready and the full editorial
          content will be added without placeholder claims.
        </p>
        <ButtonLink className="mt-8" to="/">
          Return Home
        </ButtonLink>
      </div>
    </section>
  );
}


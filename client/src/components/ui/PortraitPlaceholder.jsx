export function PortraitPlaceholder({ compact = false }) {
  const aspectRatio = compact ? 'aspect-[3/4]' : 'aspect-[4/5]';

  return (
    <figure className={`relative grid place-items-center overflow-hidden bg-[linear-gradient(145deg,#e8e2d7,#d5c7ae)] text-primary before:absolute before:top-[8%] before:left-1/2 before:aspect-square before:w-[58%] before:-translate-x-1/2 before:rounded-full before:border before:border-primary/20 before:content-[''] after:absolute after:right-[-12%] after:bottom-[-25%] after:aspect-[1.25] after:w-[125%] after:rounded-t-[50%] after:border after:border-primary/20 after:content-[''] ${aspectRatio}`}>
      <div className="relative z-[1] font-display text-[clamp(4rem,10vw,7.5rem)] text-primary/25" aria-hidden="true">
        GN
      </div>
      <figcaption className="absolute right-5 bottom-5 left-5 z-[2] border-l-2 border-emerald bg-ivory/90 px-4 py-3 text-[0.72rem] leading-[1.45] text-muted">
        <span className="mb-1 block font-bold uppercase tracking-[0.11em] text-primary">Portrait reserved</span>
        My approved photograph will appear here.
      </figcaption>
    </figure>
  );
}

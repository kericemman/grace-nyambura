export function SectionHeading({ align = 'left', children, eyebrow, tone = 'dark' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  const eyebrowColor = tone === 'light' ? 'text-champagne' : 'text-emerald';
  const headingColor = tone === 'light' ? 'text-white' : 'text-primary';

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className={`text-xs font-bold uppercase tracking-[0.16em] ${eyebrowColor}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-4 text-balance font-display text-xl leading-[1.1] tracking-tight md:text-2xl lg:text-3xl ${headingColor}`}>
        {children}
      </h2>
    </div>
  );
}



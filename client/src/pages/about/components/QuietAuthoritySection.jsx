import { Reveal } from '../../../components/ui/Reveal';
import { writingPrinciples } from '../aboutContent';

export function QuietAuthoritySection() {
  return (
    <section className="relative overflow-hidden bg-primary py-5 text-white">
      <div className="absolute top-0 right-0 h-full w-[34%] bg-white/[0.035]" aria-hidden="true" />
      <div className="absolute -bottom-52 -left-40 h-[34rem] w-[34rem] rounded-full border border-champagne/15" aria-hidden="true" />

      <div className="relative mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-24">
          <div>
            <p className="font-display text-[3.5rem] leading-none text-champagne/55 sm:text-[4.5rem]" aria-hidden="true">02</p>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-emerald">The philosophy</p>
            <h2 className="mt-4 font-display text-xl leading-[1.1] tracking-tight text-white md:text-2xl lg:text-3xl">
              Quiet Authority
            </h2>
          </div>
          <div className="border-l-2 border-champagne pl-6 sm:pl-9">
            <p className="font-display text-lg leading-[1.55] text-white md:text-2xl lg:text-3xl">
              You do not need to be the loudest person in your industry to build influence.
            </p>
            <p className="mt-5 max-w-2xl text-sm md:text-base leading-8 text-white/65">
              You need clarity about what you stand for, a consistent way to communicate it, and the confidence
              to let your experience speak. This belief shapes every content partnership.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid border-y border-white/15 px-4 lg:grid-cols-3">
          {writingPrinciples.map(([title, copy], index) => (
            <Reveal
              className={`group py-9 lg:min-h-64 lg:px-8 lg:py-10 ${index > 0 ? 'border-t border-white/15 lg:border-t-0 lg:border-l' : ''}`}
              delay={index * 0.05}
              key={title}
            >
              <span className="text-xs font-bold tracking-[0.16em] text-emerald">0{index + 1}</span>
              <h3 className="mt-8 font-display text-xl text-white md:text-2xl lg:text-3xl">{title}</h3>
              <p className="mt-4 leading-7 text-white/60">{copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

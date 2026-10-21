import { Reveal } from '../../../components/ui/Reveal';
import { aboutImages, milestones } from '../aboutContent';

export function MilestonesSection() {
  return (
    <section className="overflow-hidden bg-ivory py-5">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="grid gap-8 border-b border-border px-4 pb-12 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">
              Experience & credentials
            </p>
            <p
              className="mt-5 font-display text-2xl md:text-3xl leading-none text-champagne sm:text-[4.5rem]"
              aria-hidden="true"
            >
              03
            </p>
          </div>
          <div>
            <h2 className="max-w-4xl font-display text-lg leading-[1.18] text-primary md:text-2xl lg:text-3xl">
              Experience that brings context, care, and commercial understanding to the work.
            </h2>
            <p className="mt-5 max-w-2xl text-sm md:text-base leading-8 text-muted">
              A background across journalism, business, and digital communication shapes how I listen,
              find the useful story, and write with purpose.
            </p>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-10 px-4 sm:grid-cols-2 sm:items-stretch lg:gap-16">
          <Reveal className="relative sm:flex sm:h-full sm:flex-col">
            <div
              className="absolute -top-4 -left-4 h-24 w-24 border-t border-l border-champagne"
              aria-hidden="true"
            />
            <figure className="relative overflow-hidden bg-white p-3 shadow-[0_24px_60px_rgba(27,34,56,0.08)] sm:flex-1">
              <img
                className="aspect-[4/5] h-full w-full object-cover object-center sm:aspect-auto"
                src={aboutImages.community.src}
                width="1400"
                height="1860"
                alt={aboutImages.community.alt}
                loading="lazy"
              />
            </figure>
           
          </Reveal>

          <div className="flex h-full flex-col ">
          <h2 className="mt-6 font-display text-lg leading-[1.18] text-primary md:text-2xl lg:text-3xl">
              Milestones that shaped my perspective and approach.
            </h2>
            <p className="mt-5 max-w-2xl text-sm md:text-base leading-8 text-muted">
              A few of the experiences that have shaped how I think about content, communication, and business.
            </p>
            <div className="mt-6 flex-1" />
            {milestones.map((milestone, index) => (
              <CredentialRow index={index} key={milestone} milestone={milestone} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CredentialRow({ index, milestone }) {
  return (
    <Reveal
      className="grid grid-cols-[3rem_1fr] items-center gap-4 border-b border-primary/20 py-6 sm:grid-cols-[4rem_1fr] sm:py-7"
      delay={index * 0.035}
    >
      <span className="text-xs font-bold tracking-[0.16em] text-emerald">
        {String(index + 1).padStart(2, '0')}
      </span>
      <p className="font-display text-sm leading-7 text-primary sm:text-xl">
        {milestone}
      </p>
    </Reveal>
  );
}

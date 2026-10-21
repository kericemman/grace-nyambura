import { ArrowDownRight } from 'lucide-react';
import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { approachSteps } from '../homeContent';

export function ClientWorkSection() {
  return (
    <section className="bg-white px-4 py-10 md:py-16">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Client work">Work that goes beyond publishing posts.</SectionHeading>
   
        </Reveal>
        <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
          {approachSteps.map(([title, copy], index) => (
            <Reveal className="min-h-96 bg-white p-[clamp(1.75rem,4vw,3rem)]" delay={index * 0.05} key={title}>
              <span className="font-display text-5xl text-champagne">0{index + 1}</span>
              <h3 className="mt-12 font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h3>
              <p className="mt-4 leading-7 text-muted">{copy}</p>
              <ArrowDownRight className="mt-8 text-emerald" aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


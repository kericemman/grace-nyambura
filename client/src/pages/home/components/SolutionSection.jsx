import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { ButtonLink } from '../../../components/ui/ButtonLink';

const partnershipFlow = [
  {
    number: '01',
    title: 'We uncover the substance',
    copy: 'Your experiences, opinions, and business priorities become the raw material for the work.',
  },
  {
    number: '02',
    title: 'I shape the narrative',
    copy: 'Those ideas become clear, strategic posts written in language that still feels unmistakably yours.',
  },
  {
    number: '03',
    title: 'Your presence stays active',
    copy: 'Planning and publishing happen consistently, without content becoming another demand on your week.',
  },
];

export function SolutionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-5 md:py-16">
      {/* <div className="pointer-events-none absolute top-0 right-0 h-full w-[38%] bg-emerald/[0.055]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-0 right-[38%] h-full w-px bg-emerald/10" aria-hidden="true" /> */}

      <div className="relative mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <div className="grid gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-24">
          <Reveal>
            
            <SectionHeading eyebrow="The partnership">
              Your ideas. Your voice. A more intentional LinkedIn presence.
            </SectionHeading>
           
            
          </Reveal>

          
        </div>

        <div className="mt-8 grid border-y border-border lg:mt-10 lg:grid-cols-3">
          {partnershipFlow.map(({ number, title, copy }, index) => (
            <Reveal
              className={`group relative px-4 py-9 sm:px-8 lg:min-h-72 lg:py-10 ${index > 0 ? 'border-t border-border lg:border-t-0 lg:border-l' : ''}`}
              delay={0.08 + index * 0.05}
              key={title}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-emerald">{number}</span>
               </div>
              <h3 className="mt-10 font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">
                {title}
              </h3>
              <p className="mt-4 leading-7 text-sm text-muted">{copy}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col gap-7 bg-primary px-6 py-8 text-white sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between" delay={0.18}>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-champagne">The result</p>
            <p className="mt-3 font-display text-lg leading-[1.45] md:text-2xl lg:text-3xl">
              A steady presence that sounds like you and helps the right people understand your value.
            </p>
          </div>
          <ButtonLink
            to="/linkedin-partnership"
            variant="secondary"
            className="flex items-center bg-white border border-champagne tracking-[0.16em] text-black transition-colors duration-300 hover:text-emerald"
          >
            Let&apos;s Work Together
          </ButtonLink>
  
        
        </Reveal>
      </div>
    </section>
  );
}


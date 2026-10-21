import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';

const challenges = [
  {
    number: '01',
    title: 'You have ideas, but no time to shape them.',
    copy: 'Client work and business decisions take priority. The insight is there, but publishing it consistently becomes another unfinished task.',
  },
  {
    number: '02',
    title: 'Visibility is not the same as relevance.',
    copy: 'Attention alone does not build authority. The right content helps potential clients understand your thinking and why it matters to them.',
  },
  {
    number: '03',
    title: 'Consistency means little when your voice is missing.',
    copy: 'Generic posts may keep a calendar full, but they cannot build trust when the person reading them cannot recognize you in the writing.',
  },
];

export function ProblemSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ivory py-10 md:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(216,199,169,0.32),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(61,125,108,0.12),transparent_30%),linear-gradient(180deg,#fff_0%,#f8f6f1_48%,#f3efe7_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-champagne to-transparent" aria-hidden="true" />
      {/* <div className="pointer-events-none absolute top-0 left-[8%] -z-10 h-full w-px bg-gradient-to-b from-transparent via-champagne/40 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute top-0 right-[8%] -z-10 h-full w-px bg-gradient-to-b from-transparent via-emerald/20 to-transparent" aria-hidden="true" /> */}

      

      <div className="relative mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionHeading align="center" eyebrow="The visibility challenge">
            Your work speaks for itself. But is it reaching the people who matter?
          </SectionHeading>
          <p className="mx-auto mt-7 max-w-2xl text-sm md:text-base leading-8 text-body/75">
            Running a business gives you plenty to talk about. The difficulty is turning what you know into a
            clear, consistent presence while the business still demands your attention.
          </p>
        </Reveal>

        <div className="relative mt-16 lg:mt-24">
          <div className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent sm:left-1/2" aria-hidden="true" />

          {challenges.map(({ number, title, copy }, index) => (
            <Reveal
              className={`relative grid pb-12 sm:grid-cols-2 sm:pb-16 ${index % 2 === 0 ? '' : 'sm:text-right'}`}
              delay={index * 0.06}
              key={title}
            >
              <span className="absolute top-1 left-0 grid h-10 w-10 place-items-center rounded-full border border-champagne bg-white font-display text-sm text-primary shadow-[0_8px_24px_rgba(27,34,56,0.08)] sm:left-1/2 sm:-translate-x-1/2">
                {number}
              </span>

              <div className={`ml-16 sm:ml-0 ${index % 2 === 0 ? 'sm:pr-16' : 'sm:col-start-2 sm:pl-16'}`}>
                <h3 className="font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">
                  {title}
                </h3>
                <p className="mt-4 leading-7 text-sm text-body/70">{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-2 max-w-4xl  py-2 text-center" delay={0.18}>
          <p className="font-display text-lg leading-[1.55] text-primary md:text-2xl lg:text-3xl">
            Your expertise isn&apos;t the problem. It simply needs a clearer path from what you know to what the
            right people see.
          </p>
        </Reveal>
      </div>
    </section>
  );
}


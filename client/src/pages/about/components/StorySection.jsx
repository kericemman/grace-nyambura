import { Reveal } from '../../../components/ui/Reveal';
import { aboutImages } from '../aboutContent';

export function StorySection() {
  return (
    <section className="overflow-hidden bg-white py-section">
      <div className="mx-auto px-4 w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[0.42fr_1.58fr] lg:items-end lg:pb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">My story</p>
            <p className="mt-5 font-display text-[3.5rem] leading-none text-champagne sm:text-[4.5rem]" aria-hidden="true">01</p>
          </div>
          <h2 className="max-w-4xl font-display text-xl leading-[1.18] text-primary md:text-2xl lg:text-3xl">
            A career shaped by curiosity, clear thinking, and the stories behind the business.
          </h2>
        </Reveal>

        <div className="mt-5 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="grid content-start text-sm gap-7 leading-[1.9] text-body/85">
            <p>
              My writing journey began with a Diploma in Mass Communication and Journalism. I was especially
              drawn to newswriting and sub-editing, where I discovered the value of finding a clear story and
              communicating it with intention.
            </p>
            <p>
              That interest eventually led me to start my own blog, mamasjoint.com, where I could explore ideas
              and connect with readers through writing.
            </p>
            <div className="border-l-2 border-emerald bg-ivory px-6 py-6">
              <p className="font-display text-lg leading-[1.5] text-primary md:text-2xl lg:text-3xl">
                Good writing begins by paying attention—to people, their work, and what matters to them.
              </p>
            </div>
          </Reveal>

          <Reveal className="relative" delay={0.05}>
            <figure className="aspect-[3/2] overflow-hidden bg-ivory">
              <img
                className="h-full w-full object-cover"
                src={aboutImages.workshop.src}
                width="1500"
                height="1000"
                alt={aboutImages.workshop.alt}
                loading="lazy"
              />
            </figure>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
              Learning, listening, and exchanging ideas continue to shape how I approach every client story.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 border-t border-border pt-12 md:grid-cols-3 md:gap-0">
          <StoryChapter number="01" title="The foundation">
            Over time, I worked across media, real estate, e-commerce, healthcare, and digital communication.
          </StoryChapter>
          <StoryChapter number="02" title="The turning point">
            Sharing my own ideas on LinkedIn opened opportunities to write for founders who valued visibility.
          </StoryChapter>
          <StoryChapter number="03" title="The work today">
            I help B2B founders turn their expertise into content that is thoughtful, consistent, and authentic.
          </StoryChapter>
        </div>
      </div>
    </section>
  );
}

function StoryChapter({ children, number, title }) {
  return (
    <Reveal className="border-border py-7 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0">
      <p className="text-xs font-bold tracking-[0.16em] text-emerald">{number}</p>
      <h3 className="mt-5 font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h3>
      <p className="mt-4 leading-7 text-muted">{children}</p>
    </Reveal>
  );
}

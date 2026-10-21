import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Reveal } from '../../../components/ui/Reveal';
import { homeImages } from '../homeContent';

export function WhyGraceSection() {
  return (
    <section
      id="why-grace"
      className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-28"
    >
      <div className="mx-auto grid w-[min(100%-2rem,78rem)] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-28">

        {/* IMAGE */}
        <Reveal className="relative">
          <div className="relative mx-auto max-w-[520px] px-4 lg:mx-0">

            {/* Decorative frame */}
            <div
              aria-hidden="true"
              className="absolute -left-3 -top-3 h-28 w-28 border-l border-t border-emerald md:-left-5 md:-top-5"
            />

            <figure className="relative aspect-[4/5] overflow-hidden bg-[#e7eef5]">
              <img
                className="h-full w-full object-cover object-[50%_48%] transition-transform duration-700 hover:scale-[1.03]"
                src={homeImages.story.src}
                srcSet={homeImages.story.srcSet}
                sizes="(min-width: 1024px) 38vw, 92vw"
                width="720"
                height="900"
                alt={homeImages.story.alt}
                loading="lazy"
              />
            </figure>

            {/* Small image accent */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-emerald md:-bottom-5 md:-right-5"
            />
          </div>
        </Reveal>

        {/* CONTENT */}
        <Reveal delay={0.1}>
          <div className="max-w-[610px]">

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-emerald" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
                Why work with me
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-6 max-w-xl font-display px-4 text-xl font-medium leading-[1.13] tracking-[-0.025em] text-primary md:text-2xl lg:text-3xl">
              Good founder content begins with{' '}
              <span className="italic text-emerald">
                listening.
              </span>
            </h2>

            {/* Description */}
            <div className="mt-8 space-y-5 text-sm px-4 leading-[1.85] text-body">
              <p>
                My background is in journalism, where I learned
                that finding the right story begins with asking
                better questions and paying attention to what
                people actually mean.
              </p>

              <p>
                Today, I bring that same approach to
                founder-led LinkedIn content.
              </p>

              <p>
                I take time to understand your perspective,
                how you communicate, the experiences that
                have shaped your expertise, and what you want
                to be known for. That understanding guides
                the writing, rather than asking you to fit
                into a formula.
              </p>
            </div>

            {/* Highlighted statement */}
            <div className="mt-9 border-l-2 border-emerald pl-5 md:pl-6">
              <p className="font-display text-lg leading-[1.5] text-primary md:text-[1.5rem]">
                Because when someone reads your content,
                they should recognize your thinking,
                not the person you hired to write it.
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/about"
              className="group mt-9 inline-flex items-center gap-5 border-b border-primary pb-2.5 text-sm font-bold text-primary transition-colors duration-300 hover:border-emerald hover:text-emerald"
            >
              More About Me

              <ArrowUpRight
                size={19}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </Reveal>
      </div>
    </section>
  );
}

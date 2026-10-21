import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../../components/ui/Reveal';
import { apiRequest } from '../../lib/api';
import { useEffect } from 'react';

export function ClientStoriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ['public-case-studies', industry, page],
    queryFn: () => apiRequest(
      `/public/case-studies?industry=${encodeURIComponent(industry)}&page=${page}`,
    ),
  });
  const stories = query.data?.data ?? [];

  function selectIndustry(value) {
    setIndustry(value);
    setPage(1);
  }

  return (
    <div className="bg-white">
      <StoriesHero />

      <main className="mx-auto w-[min(100%-2rem,78rem)] py-14 md:py-20">
        {query.data?.industries?.length > 1 && (
          <div className="mb-12 flex flex-wrap gap-2 border-b border-border pb-7">
            <FilterButton active={!industry} onClick={() => selectIndustry('')}>
              All client stories
            </FilterButton>
            {query.data.industries.map((item) => (
              <FilterButton
                active={industry === item}
                key={item}
                onClick={() => selectIndustry(item)}
              >
                {item}
              </FilterButton>
            ))}
          </div>
        )}

        {query.isLoading && <LoadingState />}
        {query.isError && <ErrorState />}

        {!query.isLoading && !query.isError && stories.length > 0 && (
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
            {stories.map((story, index) => (
              <StoryCard featured={index === 0 && !industry && page === 1} key={story._id} story={story} />
            ))}
          </div>
        )}

        {!query.isLoading && !query.isError && !stories.length && (
          <EmptyStories hasFilter={Boolean(industry)} />
        )}

        <Pagination
          page={page}
          pages={query.data?.pagination?.pages ?? 0}
          onChange={setPage}
        />
      </main>

      <StoriesCta />
    </div>
  );
}

function StoriesHero() {
  return (
    <header className="relative overflow-hidden bg-ivory py-16 md:py-24">
      <div className="absolute right-0 bottom-0 h-2/3 w-1/3 bg-champagne/20" aria-hidden="true" />
      <div className="relative mx-auto grid w-[min(100%-2rem,78rem)] gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">Client stories</p>
          <h1 className="mt-5 max-w-4xl font-display text-xl leading-[1.12] text-primary md:text-2xl lg:text-3xl">
            Behind every result is a story worth understanding.
          </h1>
        </div>
       
      </div>
    </header>
  );
}

function StoryCard({ featured, story }) {
  return (
    <Reveal className={featured ? 'lg:col-span-2' : ''}>
      <article className={`group grid overflow-hidden border border-border bg-white ${featured ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
        <Link className="overflow-hidden" to={`/client-stories/${story.slug}`} aria-label={`Read ${story.projectTitle}`}>
          <StoryImage featured={featured} story={story} />
        </Link>
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald">
              <span>{story.industry}</span>
              <span className="h-1 w-1 rounded-full bg-champagne" aria-hidden="true" />
              <span>{story.company}</span>
            </div>
            <h2 className="mt-5 font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">
              <Link className="hover:text-emerald" to={`/client-stories/${story.slug}`}>
                {story.projectTitle}
              </Link>
            </h2>
            <p className="mt-5 line-clamp-4 leading-7 text-muted">{story.summary}</p>
          </div>

          {story.metrics?.length > 0 && (
            <div className="mt-7 grid grid-cols-2 gap-3 border-y border-border py-5">
              {story.metrics.slice(0, 2).map((metric) => (
                <div key={`${metric.label}-${metric.value}`}>
                  <p className="font-display text-xl text-primary md:text-2xl lg:text-3xl">{metric.value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{metric.label}</p>
                </div>
              ))}
            </div>
          )}

          <Link className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-emerald" to={`/client-stories/${story.slug}`}>
            Read the client story <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function StoryImage({ featured, story }) {
  const classes = `w-full object-cover transition duration-500 group-hover:scale-[1.02] ${featured ? 'aspect-[16/10] lg:h-full' : 'aspect-[16/10]'}`;
  if (story.coverImage) return <img className={classes} src={story.coverImage} alt="" loading="lazy" />;
  return (
    <div className={`grid place-items-center bg-primary text-champagne ${classes}`}>
      <BriefcaseBusiness size={38} strokeWidth={1.4} aria-hidden="true" />
    </div>
  );
}

function StoriesCta() {
  return (
    <section className="border-t border-border bg-primary py-16 text-white md:py-20">
      <div className="mx-auto flex w-[min(100%-2rem,62rem)] flex-col gap-7 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">Your story could be next</p>
        <h2 className="font-display text-xl md:text-2xl lg:text-3xl">
          Ready to make your expertise easier to see and understand?
        </h2>
        <Link
          className="mx-auto inline-flex min-h-12 items-center gap-2 bg-white px-5 text-sm font-bold text-primary"
          to="/contact"
        >
          Start a conversation <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      className={`min-h-10 border px-4 text-sm font-semibold ${
        active
          ? 'border-primary bg-primary text-white'
          : 'border-border bg-white text-primary hover:border-emerald'
      }`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Pagination({ onChange, page, pages }) {
  if (pages <= 1) return null;
  return (
    <nav
      className="mt-16 flex justify-center gap-3 border-t border-border pt-8"
      aria-label="Client story pages"
    >
      <button
        className="min-h-11 border border-border px-4 font-semibold disabled:opacity-40"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <span className="grid min-h-11 place-items-center px-3 text-sm text-muted">
        Page {page} of {pages}
      </span>
      <button
        className="min-h-11 border border-border px-4 font-semibold disabled:opacity-40"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

function EmptyStories({ hasFilter }) {
  return (
    <div className="grid min-h-96 place-items-center border border-border bg-ivory px-6 text-center">
      <div>
        <BriefcaseBusiness className="mx-auto text-emerald" size={32} />
        <h2 className="mt-5 font-display text-xl text-primary md:text-2xl lg:text-3xl">
          {hasFilter
            ? 'No stories in this industry yet.'
            : 'Every partnership begins with understanding.'}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">
          {hasFilter
            ? 'Choose another industry to explore more client work.'
            : 'Approved client stories will appear here. Until then, discover how I approach thoughtful founder-led content.'}
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center gap-2 border border-primary px-4 text-sm font-bold text-primary"
          to="/about"
        >
          Explore My approach <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return <div className="grid min-h-80 place-items-center text-muted">Loading client stories…</div>;
}

function ErrorState() {
  return (
    <div className="grid min-h-80 place-items-center text-center text-muted">
      Client stories could not be loaded right now.
    </div>
  );
}

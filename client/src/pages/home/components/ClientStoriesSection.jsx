import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { apiRequest } from '../../../lib/api';

export function ClientStoriesSection() {
  const query = useQuery({
    queryKey: ['homepage-latest-case-studies'],
    queryFn: () => apiRequest('/public/case-studies?limit=3&sort=latest'),
  });
  const stories = query.data?.data ?? [];

  if (!query.isLoading && !query.isError && stories.length === 0) return null;

  return (
    <section className="overflow-hidden bg-white px-4 py-10 md:py-16">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Client stories"
            title="See how we’ve helped our clients achieve their goals."
          >
            Real stories from challenges to solutions
            
            </SectionHeading> 
          

         
        </Reveal>

        {query.isLoading && <StoriesSkeleton />}

        {!query.isLoading && query.isError && (
          <p className="mt-8 border border-border bg-ivory px-6 py-8 text-center text-muted">
            Client stories could not be loaded right now.
          </p>
        )}

        {!query.isLoading && !query.isError && stories.length > 0 && (
          <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
            {stories.map((story, index) => (
              <StoryCard key={story._id} story={story} delay={index * 0.05} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCard({ delay, story }) {
  return (
    <Reveal className="h-full w-[min(86vw,24rem)] shrink-0 snap-start md:w-auto" delay={delay}>
      <article className="flex h-full min-h-64 flex-col border border-border bg-ivory p-6 sm:p-8">
        <h3 className="font-display text-lg leading-tight text-emerald md:text-xl lg:text-xl">
          <Link className="transition hover:text-emerald" to={`/client-stories/${story.slug}`}>
            {story.projectTitle}
          </Link>
        </h3>
        <p className="mt-5 line-clamp-4 flex-1 leading-7 text-sm text-muted">{story.summary}</p>
        <Link
          className="mt-7 inline-flex min-h-10 items-center gap-2 self-start text-sm font-bold text-primary transition hover:text-emerald"
          to={`/client-stories/${story.slug}`}
        >
          Read the story <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </article>
    </Reveal>
  );
}

function StoriesSkeleton() {
  return (
    <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-hidden px-4 pb-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:gap-5" aria-label="Loading client stories">
      {[0, 1, 2].map((item) => (
        <div className="h-64 w-[min(86vw,24rem)] shrink-0 animate-pulse border border-border bg-ivory md:w-auto" key={item} />
      ))}
    </div>
  );
}

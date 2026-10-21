import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../../../components/ui/ButtonLink';
import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { apiRequest } from '../../../lib/api';

export function InsightsSection() {
  const query = useQuery({
    queryKey: ['homepage-latest-articles'],
    queryFn: () => apiRequest('/public/articles?limit=3&sort=latest'),
  });
  const articles = query.data?.data ?? [];

  return (
    <section className="bg-ivory px-4 py-10 md:py-16">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Latest insights">
            Thoughts on visibility, storytelling, and building authority.
          </SectionHeading>
         
        </Reveal>

        {query.isLoading && <ArticlesSkeleton />}

        {!query.isLoading && query.isError && (
          <div className="mt-10 border border-border bg-white px-6 py-10 text-center text-muted">
            The latest insights could not be loaded right now.
          </div>
        )}

        {!query.isLoading && !query.isError && articles.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <ArticleCard article={article} delay={index * 0.05} key={article._id} />
            ))}
          </div>
        )}

        {!query.isLoading && !query.isError && articles.length === 0 && (
          <div className="mt-10 border border-border bg-white px-6 py-10 text-center text-muted">
            New insights are being prepared with care.
          </div>
        )}

        <Reveal className="mt-10 text-center">
          <ButtonLink to="/insights" variant="secondary">
            View all insights <ArrowRight size={16} />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function ArticleCard({ article, delay }) {
  return (
    <Reveal className="h-full" delay={delay}>
      <article className="group flex h-full flex-col border border-border bg-white">
        <Link className="overflow-hidden bg-primary/5" to={`/insights/${article.slug}`}>
          {article.coverImage ? (
            <img
              className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
              src={article.coverImage}
              alt=""
              loading="lazy"
            />
          ) : (
            <span className="grid aspect-[16/10] place-items-center bg-primary text-champagne">
              <BookOpen size={32} strokeWidth={1.4} />
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.13em] text-emerald">
            <span>{article.category}</span>
            <span className="h-1 w-1 rounded-full bg-champagne" aria-hidden="true" />
            <time dateTime={article.publishedAt || article.createdAt}>
              {formatDate(article.publishedAt || article.createdAt)}
            </time>
          </div>
          <h3 className="mt-5 font-display text-xl leading-tight text-primary md:text-xl lg:text-2xl">
            <Link className="transition hover:text-emerald" to={`/insights/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">{article.excerpt}</p>
          <Link
            className="mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-primary hover:text-emerald"
            to={`/insights/${article.slug}`}
          >
            Read article <ArrowRight size={16} />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function ArticlesSkeleton() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading latest insights">
      {[0, 1, 2].map((item) => (
        <div className="h-[28rem] animate-pulse border border-border bg-white" key={item} />
      ))}
    </div>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

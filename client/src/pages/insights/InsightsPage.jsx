import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Mail, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Reveal } from '../../components/ui/Reveal';
import { apiRequest } from '../../lib/api';

export function InsightsPage() {
  const { onSubscribe } = useOutletContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [category, setCategory] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ['public-articles', category, search, page],
    queryFn: () => apiRequest(
      `/public/articles?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}&page=${page}`,
    ),
  });

  const articles = query.data?.data ?? [];
  const featured = page === 1 && !category && !search
    ? articles.find((article) => article.featured) ?? articles[0]
    : null;
  const latest = featured ? articles.filter((article) => article._id !== featured._id) : articles;

  function selectCategory(value) {
    setCategory(value);
    setPage(1);
  }

  function submitSearch(event) {
    event.preventDefault();
    setSearch(draftSearch.trim());
    setPage(1);
  }

  return (
    <div className="bg-white">
      <InsightsHero />
      <FloatingSubscribeButton onClick={onSubscribe} />

      <section className="border-b border-border bg-ivory py-7">
        <div className="mx-auto flex w-[min(100%-2rem,78rem)] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
            aria-label="Article categories"
          >
            <FilterButton className="shrink-0 snap-start" active={!category} onClick={() => selectCategory('')}>
              All ideas
            </FilterButton>
            {query.data?.categories?.map((item) => (
              <FilterButton
                className="shrink-0 snap-start"
                active={category === item}
                key={item}
                onClick={() => selectCategory(item)}
              >
                {item}
              </FilterButton>
            ))}
          </div>

          <form className="flex w-full lg:max-w-sm" onSubmit={submitSearch} role="search">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search insights</span>
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                size={17}
                aria-hidden="true"
              />
              <input
                className="min-h-11 w-full border border-border bg-white pr-3 pl-10 outline-none focus:border-emerald"
                value={draftSearch}
                onChange={(event) => setDraftSearch(event.target.value)}
                placeholder="Search insights"
              />
            </label>
            <button className="min-h-11 bg-primary px-4 text-sm font-bold text-white" type="submit">
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto w-[min(100%-2rem,78rem)] py-14 md:py-20">
        {query.isLoading && <LoadingState label="Loading insights…" />}
        {query.isError && <ErrorState />}

        {!query.isLoading && !query.isError && featured && (
          <FeaturedArticle article={featured} />
        )}

        {!query.isLoading && !query.isError && latest.length > 0 && (
          <section className={featured ? 'mt-20' : ''}>
            <div className="flex items-end justify-between border-b border-border pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
                  {category || search ? 'Filtered reading' : 'Latest articles'}
                </p>
                <h2 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
                  Ideas for clearer visibility.
                </h2>
              </div>
              <p className="hidden text-sm text-muted sm:block">
                {query.data.pagination.total} article{query.data.pagination.total === 1 ? '' : 's'}
              </p>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((article, index) => (
                <ArticleCard article={article} delay={index * 0.04} key={article._id} />
              ))}
            </div>
          </section>
        )}

        {!query.isLoading && !query.isError && !articles.length && (
          <EmptyInsights hasFilters={Boolean(category || search)} />
        )}

        <Pagination
          page={page}
          pages={query.data?.pagination?.pages ?? 0}
          onChange={setPage}
        />
      </main>
    </div>
  );
}

function InsightsHero() {
  return (
    <header className="relative overflow-hidden bg-primary py-16 text-white md:py-24">
      <div className="absolute -top-36 right-[-7rem] h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />
      <div className="relative mx-auto w-[min(100%-2rem,78rem)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">Insights</p>
        <h1 className="mt-5 font-display text-xl md:text-2xl lg:text-3xl">Ideas worth thinking about.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
          Thoughts on founder visibility, LinkedIn content, storytelling, personal branding, and
          communicating professional value. Written for people who want to be better understood,
          not simply seen more often.
        </p>
      </div>
    </header>
  );
}

function FloatingSubscribeButton({ onClick }) {
  return (
    <button
      className="fixed bottom-5 left-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-champagne p-3 text-primary shadow-[0_12px_35px_rgba(27,34,56,0.18)] transition hover:-translate-y-1 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald sm:bottom-6 sm:left-6 lg:h-auto lg:w-auto lg:gap-3 lg:px-5"
      type="button"
      onClick={onClick}
      aria-label="Subscribe to the mailing list"
      title="Subscribe to the mailing list"
    >
      <Mail size={19} aria-hidden="true" />
      <span className="ml-2 hidden text-sm font-bold lg:inline">Subscribe</span>
    </button>
  );
}

function FeaturedArticle({ article }) {
  return (
    <Reveal as="section">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">Featured insight</p>
      <article className="mt-5 grid overflow-hidden border border-border bg-ivory lg:grid-cols-[1.1fr_0.9fr]">
        <ArticleImage article={article} className="aspect-[16/10] lg:h-full" />
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <ArticleMeta article={article} />
          <h2 className="mt-5 font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">
            {article.title}
          </h2>
          <p className="mt-5 line-clamp-4 leading-7 text-muted">{article.excerpt}</p>
          <ArticleLink article={article} className="mt-8" />
        </div>
      </article>
    </Reveal>
  );
}

function ArticleCard({ article, delay }) {
  return (
    <Reveal delay={delay}>
      <article className="group">
        <Link to={`/insights/${article.slug}`} aria-label={`Read ${article.title}`}>
          <ArticleImage
            article={article}
            className="aspect-[16/10] transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
        <div className="pt-5">
          <ArticleMeta article={article} />
          <h3 className="mt-4 font-display text-lg leading-snug text-primary md:text-xl">
            <Link className="hover:text-emerald" to={`/insights/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="mt-4 line-clamp-3 leading-7 text-muted">{article.excerpt}</p>
          <ArticleLink article={article} className="mt-5" />
        </div>
      </article>
    </Reveal>
  );
}

function ArticleImage({ article, className }) {
  if (article.coverImage) {
    return <img className={`w-full object-cover ${className}`} src={article.coverImage} alt="" loading="lazy" />;
  }
  return (
    <div className={`grid w-full place-items-center bg-primary text-champagne ${className}`}>
      <BookOpen size={34} strokeWidth={1.4} aria-hidden="true" />
    </div>
  );
}

function ArticleMeta({ article }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.13em] text-emerald">
      <span>{article.category}</span>
      <span className="h-1 w-1 rounded-full bg-champagne" aria-hidden="true" />
      <time dateTime={article.publishedAt || article.createdAt}>{formatDate(article.publishedAt || article.createdAt)}</time>
    </div>
  );
}

function ArticleLink({ article, className = '' }) {
  return (
    <Link
      className={`inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-emerald ${className}`}
      to={`/insights/${article.slug}`}
    >
      Read article <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

function FilterButton({ active, children, className = '', onClick }) {
  return (
    <button
      className={`min-h-10 border px-4 text-sm font-semibold transition ${className} ${
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
    <nav className="mt-16 flex justify-center gap-3 border-t border-border pt-8" aria-label="Article pages">
      <button
        className="min-h-11 border border-border px-4 font-semibold disabled:opacity-40"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <span className="grid min-h-11 place-items-center px-3 text-sm text-muted">Page {page} of {pages}</span>
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

function EmptyInsights({ hasFilters }) {
  return (
    <div className="grid min-h-80 place-items-center border border-border bg-ivory px-6 text-center">
      <div>
        <BookOpen className="mx-auto text-emerald" size={30} />
        <h2 className="mt-5 font-display text-xl text-primary md:text-2xl lg:text-3xl">
          {hasFilters ? 'No matching insights yet.' : 'Thoughtful ideas are on the way.'}
        </h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">
          {hasFilters
            ? 'Try a different category or search phrase.'
            : 'I am preparing articles on visibility, storytelling, and communicating your expertise.'}
        </p>
      </div>
    </div>
  );
}

function LoadingState({ label }) {
  return <div className="grid min-h-80 place-items-center text-muted">{label}</div>;
}

function ErrorState() {
  return (
    <div className="grid min-h-80 place-items-center text-center text-muted">
      Insights could not be loaded right now.
    </div>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

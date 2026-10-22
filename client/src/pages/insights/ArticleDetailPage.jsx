import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  List,
  Share2,
  UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PublicRichContent } from '../../components/ui/PublicRichContent';
import { apiRequest } from '../../lib/api';
import { Seo, SITE_URL } from '../../components/seo/Seo';

// Generate a table of contents from article HTML
function prepareArticleContent(html = '') {
  if (typeof DOMParser === 'undefined') {
    return { content: html, headings: [] };
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const elements = Array.from(doc.body.querySelectorAll('h2, h3'));
  const headings = [];
  const usedIds = new Set();

  elements.forEach((heading, index) => {
    const title = heading.textContent?.trim();

    if (!title) return;

    const baseId =
      title
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `section-${index + 1}`;

    let id = heading.id || baseId;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${suffix++}`;
    }

    usedIds.add(id);
    heading.id = id;

    headings.push({
      id,
      title,
      level: heading.tagName.toLowerCase(),
    });
  });

  return {
    content: doc.body.innerHTML,
    headings,
  };
}

export function ArticleDetailPage() {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState('');

  const query = useQuery({
    queryKey: ['public-article', slug],
    queryFn: () => apiRequest(`/public/articles/${slug}`),
    enabled: Boolean(slug),
  });

  const article = query.data?.data;

  const { content, headings } = useMemo(
    () => prepareArticleContent(article?.content || ''),
    [article?.content]
  );

  const readingTime = useMemo(() => {
    if (!article?.content) return 1;

    const text = article.content
      .replace(/<[^>]*>/g, ' ')
      .trim();

    const words = text.split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 220));
  }, [article?.content]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection('');
  }, [slug]);

  // Track the active article section
  useEffect(() => {
    if (!headings.length) return;

    const updateActiveSection = () => {
      let current = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 160) {
          current = heading.id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();

    window.addEventListener('scroll', updateActiveSection, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [headings]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setActiveSection(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Sharing cancelled or unavailable.
    }
  };

  if (query.isLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/10 border-t-emerald" />
          <p className="text-sm text-muted">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (query.isError || !article) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-6 text-center">
        <h1 className="font-display text-3xl text-primary">
          Article not available
        </h1>

        <p className="mt-4 max-w-md text-muted">
          The article you're looking for may have been moved or removed.
        </p>

        <Link
          to="/insights"
          className="mt-8 inline-flex items-center gap-2 font-semibold text-emerald"
        >
          <ArrowLeft size={17} />
          Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <Seo
        canonicalPath={article.canonicalUrl || `/insights/${article.slug}`}
        description={article.seoDescription || article.excerpt}
        image={article.coverImage || undefined}
        publishedTime={article.publishedAt || article.createdAt}
        title={article.seoTitle || article.title}
        type="article"
        structuredData={{
          '@context': 'https://schema.org', '@type': 'Article', headline: article.title,
          description: article.seoDescription || article.excerpt,
          image: article.coverImage || undefined,
          datePublished: article.publishedAt || article.createdAt,
          dateModified: article.updatedAt,
          mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
          author: { '@type': 'Person', name: article.author || 'Grace Nyambura', url: `${SITE_URL}/about` },
          publisher: { '@type': 'Person', name: 'Grace Nyambura', url: SITE_URL },
        }}
      />

      {/* =====================================
          HERO SECTION
          Left: Title & excerpt
          Right: Cover image
      ===================================== */}

      <header className="overflow-hidden bg-ivory">
        <div className="mx-auto w-[min(100%-2rem,80rem)] py-10 md:py-16 lg:py-20">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <Link
              to="/insights"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              All Insights
            </Link>
          </nav>

          {/* Hero grid */}
          <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">

            {/* LEFT CONTENT */}
            <div className="max-w-2xl">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-emerald" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">
                  {article.category || 'Insights'}
                </span>
              </div>

              <h1 className="text-balance font-display text-xl font-medium leading-[1.1] tracking-[-0.035em] text-primary md:text-2xl lg:text-3xl">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg sm:leading-9">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-primary/10 pt-6 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {readingTime} min read
                </span>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 font-medium transition-colors hover:text-emerald"
                >
                  <Share2 size={16} />
                  Share article
                </button>
              </div>
            </div>

            {/* RIGHT COVER IMAGE */}
            <div className="relative">
              {article.coverImage ? (
                <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(3,27,56,0.08)]">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    fetchPriority="high"
                    className="h-auto max-h-[44rem] w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-primary/5 px-10 text-center"
                  aria-hidden="true"
                >
                  <span className="font-display text-3xl text-primary/20">
                    Insights & Perspectives
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
          Left: 70% article
          Right: 30% sticky sidebar
      ===================================== */}

      <section className="py-12 md:py-20">
        <div className="mx-auto grid w-[min(100%-2rem,80rem)] items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-16 xl:gap-20">

          {/* LEFT: ARTICLE CONTENT */}
          <main className="min-w-0">

            <div className="article-body">
              <PublicRichContent html={content} />
            </div>

            {/* End of article */}
            <footer className="mt-16 border-t border-primary/10 pt-10">

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
                Keep Exploring
              </p>

              <h2 className="mt-4 font-display text-2xl text-primary md:text-3xl">
                More perspectives worth reading.
              </h2>

              <p className="mt-3 max-w-lg leading-7 text-muted">
                Explore more articles on LinkedIn visibility,
                founder authority, and building a consistent
                professional presence.
              </p>

              <Link
                to="/insights"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald"
              >
                Explore all insights

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </footer>
          </main>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:sticky lg:top-28">

            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white">

              {/* AUTHOR AND ARTICLE METADATA */}
              <div className="border-b border-primary/10 p-6 md:p-8">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  About this article
                </p>

                <div className="mt-7 flex items-center gap-4">

                  {article.authorImage ? (
                    <img
                      className="h-12 w-12 shrink-0 rounded-full bg-ivory object-cover"
                      src={article.authorImage}
                      alt={article.author || 'Article author'}
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory text-primary">
                      <UserRound size={21} />
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted">
                      Written by
                    </p>

                    <p className="mt-1 font-display text-lg font-semibold text-primary">
                      {article.author || 'Editorial Team'}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-5 border-t border-primary/10 pt-6">

                  <div>
                    <p className="text-xs font-medium text-muted">
                      Category
                    </p>

                    <p className="mt-2 text-sm font-semibold text-primary">
                      {article.category || 'Insights'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted">
                      Reading time
                    </p>

                    <p className="mt-2 text-sm font-semibold text-primary">
                      {readingTime} min read
                    </p>
                  </div>
                </div>
              </div>

              {/* TABLE OF CONTENTS */}
              {headings.length > 0 && (
                <nav
                  aria-label="Table of contents"
                  className="hidden p-6 lg:block lg:p-8"
                >

                  <div className="flex items-center gap-3">
                    <List size={18} className="text-emerald" />

                    <h2 className="font-display text-lg font-semibold text-primary">
                      On this page
                    </h2>
                  </div>

                  <div className="mt-6 max-h-[45vh] space-y-1 overflow-y-auto border-l border-primary/10">

                    {headings.map((heading) => {
                      const isActive =
                        activeSection === heading.id;

                      return (
                        <button
                          key={heading.id}
                          type="button"
                          onClick={() =>
                            scrollToSection(heading.id)
                          }
                          aria-current={isActive ? 'location' : undefined}
                          className={`
                            -ml-px block w-full border-l-2 py-2 text-left
                            text-sm leading-6 transition-all
                            ${
                              heading.level === 'h3'
                                ? 'pl-8'
                                : 'pl-4'
                            }
                            ${
                              isActive
                                ? 'border-emerald font-semibold text-primary'
                                : 'border-transparent text-muted hover:border-primary/30 hover:text-primary'
                            }
                          `}
                        >
                          {heading.title}
                        </button>
                      );
                    })}
                  </div>
                </nav>
              )}
            </div>

          </aside>
        </div>
      </section>
    </article>
  );
}

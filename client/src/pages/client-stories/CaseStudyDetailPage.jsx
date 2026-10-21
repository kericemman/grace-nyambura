import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PublicRichContent } from '../../components/ui/PublicRichContent';
import { apiRequest } from '../../lib/api';
import { useEffect } from 'react';

export function CaseStudyDetailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { slug } = useParams();
  const query = useQuery({ queryKey: ['public-case-study', slug], queryFn: () => apiRequest(`/public/case-studies/${slug}`) });
  if (query.isLoading) return <div className="grid min-h-[60vh] place-items-center text-muted">Loading story…</div>;
  if (query.isError) return <div className="grid min-h-[60vh] place-items-center px-6 text-center text-muted">This client story is not available.</div>;
  const story = query.data.data;
  const sections = [['The challenge', story.challenge], ['Objectives', story.objectives], ['My Approach', story.approach], ['My contribution', story.contribution], ['The results', story.results], ['Client perspective', story.testimonial]].filter(([, content]) => content);

  return (
    <article className="bg-white">
      <header className="bg-primary py-16 text-white md:py-24">
        <div className="mx-auto w-[min(100%-2rem,64rem)]">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white" to="/client-stories"><ArrowLeft size={16} /> Client stories</Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.16em] text-champagne">{story.industry}</p>
          <h1 className="mt-4 text-balance font-display text-xl leading-[1.1] md:text-2xl lg:text-3xl">{story.projectTitle}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{story.summary}</p>
          <p className="mt-6 text-sm font-semibold text-champagne">{story.company}</p>
        </div>
      </header>
      <div className="mx-auto grid w-[min(100%-2rem,64rem)] gap-14 py-8 md:py-15">
        {sections.map(([title, content]) => <section className="grid gap-6 border-b border-border pb-14 md:grid-cols-[0.35fr_0.65fr]" key={title}><h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">{title}</h2><PublicRichContent html={content} /></section>)}
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[60vh] w-[min(100%-1.5rem,78rem)] place-items-center py-section text-center sm:w-[min(100%-2rem,78rem)]">
      <Seo canonicalPath="/404" description="The requested page could not be found." noIndex title="Page not found" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">404</p>
        <h1 className="mt-4 font-display text-xl text-primary md:text-2xl lg:text-3xl">This page could not be found.</h1>
        <Link className="mt-8 inline-flex min-h-11 items-center border-b border-primary font-semibold text-primary" to="/">
          Return home
        </Link>
      </div>
    </section>
  );
}


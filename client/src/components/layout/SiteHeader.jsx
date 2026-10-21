import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ButtonLink } from '../ui/ButtonLink';
import { useSiteSettings } from './SiteSettingsContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Client Stories', to: '/client-stories' },
  { label: 'Insights', to: '/insights' },
];

function NavigationLinks({ onNavigate }) {
  return links.map(({ label, to }) => (
    <NavLink
      key={to}
      className={({ isActive }) => `relative flex min-h-11 items-center border-b border-border px-0.5 text-[0.9rem] font-semibold transition-colors after:absolute after:right-0 after:bottom-1 after:left-0 after:hidden after:h-px after:origin-right after:scale-x-0 after:bg-emerald after:transition-transform after:content-[''] hover:text-emerald lg:border-0 lg:px-0 lg:after:block lg:hover:after:origin-left lg:hover:after:scale-x-100 ${isActive ? 'text-emerald lg:after:origin-left lg:after:scale-x-100' : 'text-body'}`}
      onClick={onNavigate}
      to={to}
    >
      {label}
    </NavLink>
  ));
}

export function SiteHeader({ onSubscribe }) {
  const [open, setOpen] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-ivory/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-20 w-[min(100%-2rem,78rem)] items-center justify-between gap-6">
        <NavLink
          className="leading-none"
          to="/"
          aria-label="Grace Nyambura home"
          onClick={() => setOpen(false)}
        >
          <span className="block font-display text-[1.55rem] font-semibold tracking-[-0.02em] text-primary">Grace Nyambura</span>
          <span className="mt-1 block text-[0.63rem] font-bold uppercase tracking-[0.18em] text-emerald">LinkedIn Content Partner</span>
        </NavLink>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          <NavigationLinks />
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button
            className="min-h-10 border border-primary px-4 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
            type="button"
            onClick={onSubscribe}
          >
            Subscribe
          </button>
          <ButtonLink to="/contact" size="compact">
            {settings.homepageCta}
          </ButtonLink>
        </div>
        <button
          className="grid h-11 w-11 cursor-pointer place-items-center border border-border bg-white text-primary transition-colors hover:border-primary lg:hidden"
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="border-t border-border bg-ivory" aria-label="Mobile navigation">
          <div className="mx-auto flex w-[min(100%-2rem,78rem)] flex-col py-5">
            <NavigationLinks onNavigate={() => setOpen(false)} />
            <button
              className="mt-5 min-h-11 border border-primary px-4 text-sm font-bold text-primary"
              type="button"
              onClick={() => {
                setOpen(false);
                onSubscribe();
              }}
            >
              Subscribe
            </button>
            <ButtonLink className="mt-5 w-full" to="/contact">
              {settings.homepageCta}
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}


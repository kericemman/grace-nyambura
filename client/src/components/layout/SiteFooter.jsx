import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from './SiteSettingsContext';

const pageLinks = [
  ['About', '/about'],
  ['LinkedIn Partnership', '/linkedin-partnership'],
  ['Client Stories', '/client-stories'],
  ['Insights', '/insights'],
  ['Contact', '/contact'],
];

const legalLinks = [
  ['Privacy Policy', '/privacy-policy'],
  ['Terms', '/terms'],
];

export function SiteFooter() {
  const settings = useSiteSettings();
  const socialLinks = [
    [settings.linkedInUrl, 'LinkedIn', Linkedin],
    [settings.instagramUrl, 'Instagram', Instagram],
    [settings.facebookUrl, 'Facebook', Facebook],
  ].filter(([href]) => href);

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto grid w-[min(100%-2rem,78rem)] gap-12 py-16 md:grid-cols-[1.4fr_0.7fr_0.7fr] lg:py-20">
        <div className="max-w-md">
          <p className="font-display text-3xl">Grace Nyambura</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-champagne">LinkedIn Content Partner</p>
          <p className="mt-6 leading-7 text-white/70">
            Helping B2B founders communicate their expertise through authentic, strategic LinkedIn content.
          </p>
          <div className="mt-7 flex gap-3">
            {socialLinks.map(([href, label, Icon]) => <SocialLink href={href} label={label} key={label}><Icon size={18} /></SocialLink>)}
          </div>
        </div>
        <FooterGroup title="Explore" links={pageLinks} />
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.17em] text-champagne">Get in touch</p>
          <a className="mt-5 flex items-center gap-2.5 overflow-wrap-anywhere text-white/75 transition-colors hover:text-champagne" href={`mailto:${settings.businessEmail}`}>
            <Mail size={17} aria-hidden="true" />
            {settings.businessEmail}
          </a>
          <a className="mt-4 flex items-center gap-2.5 overflow-wrap-anywhere text-white/75 transition-colors hover:text-champagne" href={`tel:${settings.phone.replace(/\s/g, '')}`}>
            <Phone size={17} aria-hidden="true" />
            {settings.phone}
          </a>
          <div className="mt-8 flex flex-col gap-3">
            {legalLinks.map(([label, to]) => (
              <Link className="text-white/70 transition-colors hover:text-white" key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-[min(100%-2rem,78rem)] flex-col gap-2 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Grace Nyambura</p>
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.17em] text-champagne">{title}</p>
      <div className="mt-5 flex flex-col gap-3">
        {links.map(([label, to]) => (
          <Link className="text-white/70 transition-colors hover:text-white" key={to} to={to}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a className="grid h-11 w-11 place-items-center border border-white/20 transition-colors hover:border-champagne hover:text-champagne" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  );
}


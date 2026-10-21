import {
  BookOpenText,
  BriefcaseBusiness,
  FileText,
  FolderOpen,
  Gauge,
  Inbox,
  Send,
  MailPlus,
  Settings,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Overview', to: '/admin', icon: Gauge, end: true },
  { label: 'Articles', to: '/admin/articles', icon: FileText },
  { label: 'Client Case Studies', to: '/admin/case-studies', icon: BriefcaseBusiness },
  { label: 'Testimonials', to: '/admin/testimonials', icon: UsersRound },
  { label: 'Media Library', to: '/admin/media', icon: FolderOpen },
  { label: 'Enquiries', to: '/admin/enquiries', icon: Inbox },
  { label: 'Partnership Applications', to: '/admin/partnership-applications', icon: Send },
  { label: 'Mailing List', to: '/admin/subscribers', icon: MailPlus },
];

const accountNavigation = [
  { label: 'Website Settings', to: '/admin/settings', icon: Settings },
  { label: 'Admin Profile', to: '/admin/profile', icon: UserRound },
];

function NavigationGroup({ items, onNavigate }) {
  return items.map(({ label, to, icon: Icon, end }) => (
    <NavLink
      className={({ isActive }) => `group flex min-h-11 items-center gap-3 border-l-2 px-4 text-sm font-semibold transition-colors ${isActive ? 'border-champagne bg-white/10 text-white' : 'border-transparent text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'}`}
      end={end}
      key={to}
      onClick={onNavigate}
      to={to}
    >
      <Icon className="shrink-0" size={18} strokeWidth={1.7} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  ));
}

export function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-primary/55 backdrop-blur-sm lg:hidden" type="button" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[18rem] flex-col bg-primary text-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <p className="font-display text-xl font-semibold">Grace Nyambura</p>
            <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-champagne">Content administration</p>
          </div>
          <button className="grid h-10 w-10 place-items-center text-white/60 hover:text-white lg:hidden" type="button" aria-label="Close navigation" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Admin navigation">
          <p className="px-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/35">Workspace</p>
          <div className="mt-3 grid gap-1"><NavigationGroup items={navigation} onNavigate={onClose} /></div>
          <div className="my-6 h-px bg-white/10" />
          <p className="px-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/35">Account</p>
          <div className="mt-3 grid gap-1"><NavigationGroup items={accountNavigation} onNavigate={onClose} /></div>
        </nav>

        <div className="border-t border-white/10 p-5">
          <a className="flex items-center gap-3 text-sm font-semibold text-white/55 transition-colors hover:text-white" href="/" target="_blank" rel="noreferrer">
            <BookOpenText size={17} aria-hidden="true" />
            View public website
          </a>
        </div>
      </aside>
    </>
  );
}

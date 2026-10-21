import { ChevronDown, LogOut, Menu, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../../lib/api';

export function AdminTopbar({ onOpenNavigation, user }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      navigate('/admin/login', { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button className="grid h-11 w-11 place-items-center border border-border text-primary lg:hidden" type="button" aria-label="Open navigation" onClick={onOpenNavigation}>
          <Menu size={20} aria-hidden="true" />
        </button>
        <div>
          <p className="text-sm font-semibold text-primary">Content workspace</p>
          <p className="mt-0.5 hidden text-xs text-muted sm:block">Manage the website and publishing workflow</p>
        </div>
      </div>

      <div className="relative">
        <button className="flex min-h-12 items-center gap-3 px-2 text-left transition-colors hover:bg-ivory sm:px-3" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald/10 font-display font-semibold text-emerald">GN</span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-primary">{user?.name ?? 'Grace Nyambura'}</span>
            <span className="block text-xs capitalize text-muted">{user?.role ?? 'Administrator'}</span>
          </span>
          <ChevronDown className="text-muted" size={15} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] right-0 w-56 border border-border bg-white p-2 shadow-[0_18px_50px_rgba(27,34,56,0.14)]">
            <button className="flex min-h-11 w-full items-center gap-3 px-3 text-sm font-semibold text-body hover:bg-ivory" type="button" onClick={() => navigate('/admin/profile')}>
              <UserRound size={17} aria-hidden="true" />
              Admin profile
            </button>
            <button className="flex min-h-11 w-full items-center gap-3 px-3 text-sm font-semibold text-red-700 hover:bg-red-50" type="button" disabled={signingOut} onClick={signOut}>
              <LogOut size={17} aria-hidden="true" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

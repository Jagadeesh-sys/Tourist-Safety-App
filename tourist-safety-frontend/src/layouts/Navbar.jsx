import { useState } from 'react';
import { FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import ThemeToggle from '../components/common/ThemeToggle';
import NotificationPanel from '../components/dashboard/NotificationPanel';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import Button from '../components/common/Button';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2 lg:hidden dark:border-slate-700"
            onClick={onMenuClick}
          >
            <FiMenu size={20} />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex dark:border-slate-700 dark:bg-slate-900">
            <FiSearch />
            <span>Search trips, places, alerts…</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <button
              type="button"
              onClick={() => setPanelOpen((o) => !o)}
              className="relative rounded-xl border border-slate-200 p-2.5 dark:border-slate-700"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout} className="!py-2 !text-xs">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

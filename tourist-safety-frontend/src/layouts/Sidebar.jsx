import { NavLink } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import { navigationByRole } from '../utils/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const links = navigationByRole[user?.role] ?? [];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <Logo size="sm" tagline={`${user?.role?.toLowerCase() ?? 'user'} portal`} />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map(({ path, label, icon: Icon, danger }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? danger
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      : 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                    : danger
                      ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

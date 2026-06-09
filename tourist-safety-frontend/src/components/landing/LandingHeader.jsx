import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from '../brand/Logo';
import { NAV_LINKS } from '../../data/landingContent';
import { authService } from '../../services/authService';
import { resolveRoleHomePath } from '../../utils/navigation';

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const user = authService.getStoredUser();
  const dashboardPath = user ? resolveRoleHomePath(user) : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) =>
    pathname === '/' && (href === '#home' ? !hash || hash === '#home' : hash === href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <Link to="/" className="group shrink-0 transition hover:opacity-95">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                window.location.pathname === link.href
                  ? 'bg-landing-primary/10 text-landing-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {dashboardPath ? (
            <Link to={dashboardPath} className="landing-btn-primary !px-5 !py-2.5">
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link to="/auth/register" className="landing-btn-primary !px-5 !py-2.5">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {dashboardPath ? (
              <Link
                to={dashboardPath}
                className="landing-btn-primary justify-center py-3"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="landing-btn-primary justify-center py-3"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

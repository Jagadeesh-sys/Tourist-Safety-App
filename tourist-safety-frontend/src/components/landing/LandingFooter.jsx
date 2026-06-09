import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiTwitter, FiYoutube } from 'react-icons/fi';
import Logo from '../brand/Logo';
import { FOOTER_QUICK_LINKS, FOOTER_SUPPORT } from '../../data/landingContent';

export default function LandingFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-landing-navy text-slate-300">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-landing-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4 lg:py-20">
        <div className="space-y-5 lg:col-span-1">
          <Logo size="md" variant="light" tagline="" />
          <p className="text-sm leading-relaxed text-slate-400">
            India&apos;s intelligent travel safety platform — real-time alerts, emergency response, and
            verified safe places for every journey.
          </p>
          <div className="flex gap-2">
            {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-landing-primary/50 hover:bg-landing-primary/20 hover:text-white"
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {FOOTER_QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-slate-400 transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Support</h4>
          <ul className="space-y-3 text-sm">
            {FOOTER_SUPPORT.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-slate-400 transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex gap-3">
              <FiMapPin className="mt-0.5 shrink-0 text-landing-primary" size={16} />
              <span>123 Safety Street, New Delhi, India 110001</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="shrink-0 text-landing-primary" size={16} />
              <a href="tel:+911800123456" className="hover:text-white">
                +91 1800-123-456
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="shrink-0 text-landing-primary" size={16} />
              <a href="mailto:support@touristsafety.com" className="hover:text-white">
                support@touristsafety.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Tourist Safety Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#contact" className="hover:text-slate-300">Privacy</a>
            <a href="#contact" className="hover:text-slate-300">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

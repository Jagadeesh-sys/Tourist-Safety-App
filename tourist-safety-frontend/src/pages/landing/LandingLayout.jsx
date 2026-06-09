import { Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingFooter from '../../components/landing/LandingFooter';

export default function LandingLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <LandingHeader />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {title && (
          <div className="mb-8 border-b border-slate-200 pb-6">
            <nav className="text-sm text-slate-500 mb-2">
              <Link to="/" className="hover:text-landing-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-medium">{title}</span>
            </nav>
            <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
          </div>
        )}
        <main>{children}</main>
      </div>
      <LandingFooter />
    </div>
  );
}

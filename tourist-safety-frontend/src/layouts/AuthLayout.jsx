import { Link, Outlet } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import { APP_NAME } from '../utils/constants';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29sbyUyMHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D)'
        }}>
          <div className="absolute inset-0 bg-gradient-to-br from-landing-navy/90 via-[#0e7490]/80 to-sky-500/80"></div>
        </div>
        <Link to="/" className="relative z-10 transition hover:opacity-90">
          <Logo size="md" variant="light" />
        </Link>
        <div className="relative z-10">
          <h1 className="mt-16 max-w-md text-4xl font-extrabold leading-tight">{APP_NAME}</h1>
          <p className="mt-4 max-w-lg text-sky-100">
            Plan smarter trips, discover attractions, track safety in real time, and access emergency
            services — all in one intelligent platform.
          </p>
        </div>
        <p className="relative z-10 mt-8 text-sm text-sky-200/90">Trusted by tourists, operators, and emergency responders.</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <Link to="/" className="mb-8 lg:hidden">
          <Logo size="sm" />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}

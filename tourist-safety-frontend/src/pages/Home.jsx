import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { resolveRoleHomePath } from '../utils/navigation';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCloud,
  FiGlobe,
  FiMapPin,
  FiMessageCircle,
  FiNavigation,
  FiPhone,
  FiSearch,
  FiShield,
  FiStar,
  FiSun,
  FiUsers,
  FiBook,
  FiHome as FiHomeIcon,
  FiCoffee,
  FiActivity,
  FiRadio,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import DestinationCard from '../components/landing/DestinationCard';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import SectionHeader from '../components/landing/SectionHeader';
import HomeSkeleton from '../components/landing/HomeSkeleton';
import IconBox from '../components/landing/IconBox';
import GoogleMapView from '../components/maps/GoogleMapView';
import { contentService } from '../services/contentService';
import { mapService } from '../services/mapService';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80';

const STATS = [
  { value: '50K+', label: 'Travelers protected' },
  { value: '24/7', label: 'Safety monitoring' },
  { value: '120+', label: 'Destinations covered' },
  { value: '< 2 min', label: 'SOS response time' },
];

const FEATURES = [
  {
    icon: FiRadio,
    title: 'Live Tracking',
    desc: 'Share your real-time location with trusted contacts and emergency responders.',
  },
  {
    icon: FiBell,
    title: 'Smart Alerts',
    desc: 'Geo-fence warnings, weather updates, and regional safety notifications.',
  },
  {
    icon: FiShield,
    title: 'Verified Safe Places',
    desc: 'Hotels, restaurants, and hospitals rated for tourist safety.',
  },
  {
    icon: FiNavigation,
    title: 'AI Route Planning',
    desc: 'Intelligent routes that avoid high-risk zones and unsafe areas.',
  },
];

const alertIcons = { rain: FiNavigation, road: FiAlertTriangle, heat: FiSun };
const alertColors = {
  blue: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20',
  orange: 'bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20',
  amber: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20',
};
const emergencyStyles = {
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/80 text-blue-800',
  red: 'from-rose-500/10 to-rose-600/5 border-rose-200/80 text-rose-800',
  orange: 'from-orange-500/10 to-orange-600/5 border-orange-200/80 text-orange-800',
  green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/80 text-emerald-800',
};
const guideColors = {
  blue: 'bg-blue-500/10 text-blue-600',
  purple: 'bg-violet-500/10 text-violet-600',
  orange: 'bg-orange-500/10 text-orange-600',
  green: 'bg-emerald-500/10 text-emerald-600',
};
const guideIcons = { tips: FiBook, laws: FiShield, weather: FiCloud, language: FiMessageCircle };
const safeIcons = { hotel: FiHomeIcon, restaurant: FiCoffee, police: FiShield, hospital: FiActivity };

const FALLBACK_DEST_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=800&fit=crop&q=80';



export default function Home() {
  const [landing, setLanding] = useState({
    destinations: [
      { id: 1, name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', rating: 4.9, reviews: 1500 },
      { id: 2, name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600', rating: 4.8, reviews: 1200 },
      { id: 3, name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', rating: 4.9, reviews: 2100 },
      { id: 4, name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', rating: 4.8, reviews: 1700 },
      { id: 5, name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', rating: 4.7, reviews: 350 },
      { id: 6, name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-74b23455969b?w=600', rating: 4.8, reviews: 2000 },
      { id: 7, name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', rating: 4.7, reviews: 2500 },
      { id: 8, name: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', rating: 4.9, reviews: 3000 },
      { id: 9, name: 'Varanasi', image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600', rating: 4.8, reviews: 2200 },
    ],
    safetyAlerts: [],
    emergencyServices: [],
    safePlaces: [],
    travelGuide: [],
    testimonials: [],
  });
  const [mapPreview, setMapPreview] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    contentService.getLanding().then((data) => {
      console.log('Landing data:', data);
      setLanding(data);
    }).catch(err => console.error('Error fetching landing:', err));
    mapService.getSafePlaces().then(setMapPreview);
  }, []);

  const testimonials = landing?.testimonials ?? [];
  const visibleTestimonials = 3;
  const maxIndex = Math.max(0, testimonials.length - visibleTestimonials);

  if (authService.isAuthenticated()) {
    const user = authService.getStoredUser();
    return (
      <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
        <div className="bg-brand-50 border-b border-brand-100 px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-brand-600" size={20} />
              <span className="text-sm font-medium text-brand-800">You're already signed in as {user?.name || 'User'}</span>
            </div>
            <Link
              to={resolveRoleHomePath(user)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Go to Dashboard
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
        <LandingHeader />
        {/* Rest of Home content */}
        {(() => {
          const { destinations = [], safetyAlerts = [], emergencyServices = [], safePlaces = [], travelGuide = [], testimonials = [] } = landing || {};
          return (
            <>
              {/* Hero */}
              <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
                <div className="absolute inset-0">
                  <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-landing-navy/90 via-landing-navy/70 to-landing-primary/40" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6 md:pb-40 md:pt-32 lg:pt-40">
                  <div className="max-w-3xl">
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      <FiShield size={14} className="text-sky-300" />
                      Trusted travel safety platform
                    </span>
                    <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                      Explore India with{' '}
                      <span className="bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">
                        confidence & safety
                      </span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
                      Real-time safety alerts, emergency SOS, verified destinations, and intelligent route
                      planning — everything you need for a secure journey.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                      <Link to={resolveRoleHomePath(user)} className="landing-btn-primary shadow-glow">
                        <FaPlane size={16} />
                        Go to Dashboard
                      </Link>
                      <a href="#features" className="landing-btn-secondary">
                        Learn More
                        <FiArrowRight size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Stats strip */}
                  <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:grid-cols-4 md:gap-6">
                    {STATS.map((s) => (
                      <div key={s.label} className="text-center md:text-left">
                        <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
                        <p className="mt-1 text-xs font-medium text-slate-300 md:text-sm">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search bar */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 md:px-6">
                  <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-elevated">
                    <div className="flex flex-col md:flex-row md:items-stretch md:divide-x md:divide-slate-100">
                      {[
                        { label: 'Destination', icon: FiMapPin, iconColor: 'text-landing-primary', type: 'text', placeholder: 'Where are you going?' },
                        { label: 'Start Date', icon: FiCalendar, type: 'date' },
                        { label: 'End Date', icon: FiCalendar, type: 'date' },
                      ].map((field) => (
                        <label key={field.label} className="flex flex-1 flex-col gap-1 px-5 py-4">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{field.label}</span>
                          <span className="flex items-center gap-2">
                            <field.icon size={16} className={field.iconColor ?? 'text-slate-400'} />
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                            />
                          </span>
                        </label>
                      ))}
                      <label className="flex flex-1 flex-col gap-1 px-5 py-4">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Travelers</span>
                        <span className="flex items-center gap-2">
                          <FiUsers size={16} className="text-slate-400" />
                          <select className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 outline-none">
                            <option>1 Traveler</option>
                            <option>2 Travelers</option>
                            <option>3+ Travelers</option>
                          </select>
                        </span>
                      </label>
                      <div className="flex items-center p-3 md:p-4">
                        <button type="button" className="landing-btn-primary w-full md:w-auto md:whitespace-nowrap">
                          <FiSearch size={18} />
                          Search Trips
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-24 md:h-28" />

              {/* Features */}
              <section id="features" className="landing-section bg-landing-slate">
                <SectionHeader
                  eyebrow="Why TouristSafety"
                  title="Everything you need for safe travel"
                  subtitle="From planning to emergencies — one platform keeps you informed and protected throughout your journey."
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {FEATURES.map((f) => (
                    <article key={f.title} className="landing-card-hover group p-6">
                      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-landing-primary/10 text-landing-primary transition group-hover:bg-landing-primary group-hover:text-white">
                        <f.icon size={22} />
                      </span>
                      <h3 className="font-bold text-slate-900">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* Destinations */}
              <section id="destinations" className="landing-section">
                <SectionHeader
                  eyebrow="Explore"
                  title="Popular destinations"
                  subtitle="Top-rated places with real safety scores and traveler reviews."
                  action={
                    <Link
                      to={resolveRoleHomePath(user)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-landing-primary hover:gap-3 transition-all"
                    >
                      View Dashboard
                      <FiArrowRight size={16} />
                    </Link>
                  }
                />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                  {destinations?.map((dest) => {
                    console.log('Rendering destination:', dest);
                    return <DestinationCard key={dest.id ?? dest.name} dest={dest} />;
                  })}
                </div>
              </section>

              {/* Alerts + Emergency */}
              <section className="landing-section bg-landing-slate">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div id="alerts" className="landing-card p-8">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                        <FiAlertTriangle size={22} />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Real-time safety alerts</h2>
                        <p className="text-sm text-slate-500">Updated live from regional safety feeds</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {safetyAlerts?.map((alert) => (
                        <li
                          key={alert.title}
                          className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white"
                        >
                          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${alertColors[alert.color] ?? alertColors.blue}`}>
                            <IconBox icon={alertIcons[alert.icon]} size={20} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800">{alert.title}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{alert.time}</p>
                          </div>
                          <FiArrowRight className="shrink-0 text-slate-300" size={16} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div id="emergency" className="landing-card p-8">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-landing-primary/10 text-landing-primary">
                        <FiPhone size={22} />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Emergency services</h2>
                        <p className="text-sm text-slate-500">One tap to reach help instantly</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {emergencyServices?.map((svc) => (
                        <div
                          key={svc.name}
                          className={`flex flex-col items-center rounded-2xl border bg-gradient-to-br p-5 text-center ${emergencyStyles[svc.color]}`}
                        >
                          <FiPhone size={22} className="mb-2 opacity-70" />
                          <p className="text-sm font-semibold">{svc.name}</p>
                          <p className="my-1 text-3xl font-bold tracking-tight">{svc.number}</p>
                          <button
                            type="button"
                            className="mt-2 rounded-lg bg-white/90 px-4 py-1.5 text-xs font-bold shadow-sm transition hover:bg-white"
                          >
                            {svc.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Safe places + Guide */}
              <section className="landing-section">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div id="safe-places" className="landing-card overflow-hidden">
                    <div className="border-b border-slate-100 p-8 pb-6">
                      <SectionHeader
                        eyebrow="Nearby"
                        title="Safe places"
                        subtitle="Verified hotels, restaurants, and emergency facilities."
                      />
                    </div>
                    <div className="grid gap-6 p-8 pt-0 lg:grid-cols-2">
                      <ul className="space-y-2">
                        {safePlaces?.map((place) => (
                          <li
                            key={place.label}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3.5 transition hover:border-landing-primary/20 hover:bg-landing-primary/5"
                          >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-landing-primary/10 text-landing-primary">
                              <IconBox icon={safeIcons[place.icon]} size={18} />
                            </span>
                            <div>
                              <p className="font-semibold text-slate-800">{place.label}</p>
                              {place.count && <p className="text-xs text-slate-400">{place.count} verified nearby</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <GoogleMapView
                          height="240px"
                          center={mapPreview?.center}
                          markers={mapPreview?.markers ?? []}
                          zoom={11}
                        />
                      </div>
                    </div>
                    <div className="border-t border-slate-100 px-8 py-4">
                      <Link
                        to={resolveRoleHomePath(user)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-landing-primary hover:gap-3 transition-all"
                      >
                        Open full map
                        <FiArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div id="travel-guide" className="landing-card p-8">
                    <SectionHeader
                      eyebrow="Resources"
                      title="Travel guide"
                      subtitle="Essential information for every destination."
                    />
                    <div className="grid grid-cols-2 gap-4">
                      {travelGuide?.map((item) => (
                        <div
                          key={item.title}
                          className="group rounded-2xl border border-slate-100 p-5 transition hover:border-landing-primary/30 hover:shadow-md"
                        >
                          <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${guideColors[item.color] ?? 'bg-slate-100 text-slate-600'}`}>
                            <IconBox icon={guideIcons[item.icon]} size={22} />
                          </span>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <a
                            href="#travel-guide"
                            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-landing-primary group-hover:gap-2 transition-all"
                          >
                            {item.subtitle}
                            <FiArrowRight size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="landing-section bg-landing-slate">
                <SectionHeader
                  eyebrow="Testimonials"
                  title="What travelers say"
                  subtitle="Real stories from tourists who travel safer with us."
                  action={
                    <a href="#contact" className="inline-flex items-center gap-1 text-sm font-semibold text-landing-primary">
                      All reviews <FiArrowRight size={16} />
                    </a>
                  }
                />
                <div className="relative flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setTestimonialIndex((i) => Math.max(0, i - 1))}
                    disabled={testimonialIndex === 0}
                    className="hidden shrink-0 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:bg-white hover:shadow-md disabled:opacity-30 md:flex"
                    aria-label="Previous"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <div className="grid flex-1 gap-6 md:grid-cols-3">
                    {testimonials.slice(testimonialIndex, testimonialIndex + visibleTestimonials).map((t) => (
                      <article key={t.name} className="landing-card p-7">
                        <div className="mb-1 flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className="fill-amber-400 text-amber-400" size={14} />
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
                        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                          <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100" />
                          <div>
                            <p className="font-bold text-slate-900">{t.name}</p>
                            <p className="text-xs text-slate-400">Verified traveler</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTestimonialIndex((i) => Math.min(maxIndex, i + 1))}
                    disabled={testimonialIndex >= maxIndex}
                    className="hidden shrink-0 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:shadow-md disabled:opacity-30 md:flex"
                    aria-label="Next"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </section>

              {/* CTA */}
              <section className="landing-section !py-12">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-landing-primary via-blue-600 to-sky-500 px-8 py-16 text-center shadow-glow md:px-16 md:py-20">
                  <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-40" />
                  <div className="relative mx-auto max-w-2xl">
                    <FiGlobe className="mx-auto mb-4 text-white/80" size={40} />
                    <h2 className="text-3xl font-bold text-white md:text-4xl">Start your safe journey today</h2>
                    <p className="mt-4 text-lg text-blue-100">
                      Join thousands of travelers who explore India with real-time safety at their fingertips.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <Link to={resolveRoleHomePath(user)} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-landing-primary shadow-lg transition hover:bg-blue-50">
                        Go to Dashboard
                        <FiArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <LandingFooter />
            </>
          );
        })()}
      </div>
    );
  }

  if (!landing) return <HomeSkeleton />;

  const {
    destinations = [],
    safetyAlerts = [],
    emergencyServices = [],
    safePlaces = [],
    travelGuide = [],
  } = landing || {};

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <LandingHeader />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-landing-navy/90 via-landing-navy/70 to-landing-primary/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6 md:pb-40 md:pt-32 lg:pt-40">
          <div className="max-w-3xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <FiShield size={14} className="text-sky-300" />
              Trusted travel safety platform
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              Explore India with{' '}
              <span className="bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">
                confidence & safety
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
              Real-time safety alerts, emergency SOS, verified destinations, and intelligent route
              planning — everything you need for a secure journey.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/auth/register" className="landing-btn-primary shadow-glow">
                <FaPlane size={16} />
                Plan Your Trip
              </Link>
              <a href="#features" className="landing-btn-secondary">
                Learn More
                <FiArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:grid-cols-4 md:gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-300 md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 md:px-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-elevated">
            <div className="flex flex-col md:flex-row md:items-stretch md:divide-x md:divide-slate-100">
              {[
                { label: 'Destination', icon: FiMapPin, iconColor: 'text-landing-primary', type: 'text', placeholder: 'Where are you going?' },
                { label: 'Start Date', icon: FiCalendar, type: 'date' },
                { label: 'End Date', icon: FiCalendar, type: 'date' },
              ].map((field) => (
                <label key={field.label} className="flex flex-1 flex-col gap-1 px-5 py-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{field.label}</span>
                  <span className="flex items-center gap-2">
                    <field.icon size={16} className={field.iconColor ?? 'text-slate-400'} />
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                    />
                  </span>
                </label>
              ))}
              <label className="flex flex-1 flex-col gap-1 px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Travelers</span>
                <span className="flex items-center gap-2">
                  <FiUsers size={16} className="text-slate-400" />
                  <select className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 outline-none">
                    <option>1 Traveler</option>
                    <option>2 Travelers</option>
                    <option>3+ Travelers</option>
                  </select>
                </span>
              </label>
              <div className="flex items-center p-3 md:p-4">
                <button type="button" className="landing-btn-primary w-full md:w-auto md:whitespace-nowrap">
                  <FiSearch size={18} />
                  Search Trips
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-24 md:h-28" />

      {/* Features */}
      <section id="features" className="landing-section bg-landing-slate">
        <SectionHeader
          eyebrow="Why TouristSafety"
          title="Everything you need for safe travel"
          subtitle="From planning to emergencies — one platform keeps you informed and protected throughout your journey."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="landing-card-hover group p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-landing-primary/10 text-landing-primary transition group-hover:bg-landing-primary group-hover:text-white">
                <f.icon size={22} />
              </span>
              <h3 className="font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="landing-section">
        <SectionHeader
          eyebrow="Explore"
          title="Popular destinations"
          subtitle="Top-rated places with real safety scores and traveler reviews."
          action={
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-1 text-sm font-semibold text-landing-primary hover:gap-2 transition-all"
            >
              View all destinations
              <FiArrowRight size={16} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
		{destinations?.map((dest) => {
                  console.log('Rendering destination:', dest);
                  return <DestinationCard key={dest.id ?? dest.name} dest={dest} />;
                })}
        </div>
      </section>

      {/* Alerts + Emergency */}
      <section className="landing-section bg-landing-slate">
        <div className="grid gap-8 lg:grid-cols-2">
          <div id="alerts" className="landing-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                <FiAlertTriangle size={22} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Real-time safety alerts</h2>
                <p className="text-sm text-slate-500">Updated live from regional safety feeds</p>
              </div>
            </div>
            <ul className="space-y-3">
              {safetyAlerts?.map((alert) => (
                <li
                  key={alert.title}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${alertColors[alert.color] ?? alertColors.blue}`}>
                    <IconBox icon={alertIcons[alert.icon]} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{alert.time}</p>
                  </div>
                  <FiArrowRight className="shrink-0 text-slate-300" size={16} />
                </li>
              ))}
            </ul>
          </div>

          <div id="emergency" className="landing-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-landing-primary/10 text-landing-primary">
                <FiPhone size={22} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Emergency services</h2>
                <p className="text-sm text-slate-500">One tap to reach help instantly</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {emergencyServices?.map((svc) => (
                <div
                  key={svc.name}
                  className={`flex flex-col items-center rounded-2xl border bg-gradient-to-br p-5 text-center ${emergencyStyles[svc.color]}`}
                >
                  <FiPhone size={22} className="mb-2 opacity-70" />
                  <p className="text-sm font-semibold">{svc.name}</p>
                  <p className="my-1 text-3xl font-bold tracking-tight">{svc.number}</p>
                  <button
                    type="button"
                    className="mt-2 rounded-lg bg-white/90 px-4 py-1.5 text-xs font-bold shadow-sm transition hover:bg-white"
                  >
                    {svc.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safe places + Guide */}
      <section className="landing-section">
        <div className="grid gap-8 lg:grid-cols-2">
          <div id="safe-places" className="landing-card overflow-hidden">
            <div className="border-b border-slate-100 p-8 pb-6">
              <SectionHeader
                eyebrow="Nearby"
                title="Safe places"
                subtitle="Verified hotels, restaurants, and emergency facilities."
              />
            </div>
            <div className="grid gap-6 p-8 pt-0 lg:grid-cols-2">
              <ul className="space-y-2">
                {safePlaces?.map((place) => (
                  <li
                    key={place.label}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3.5 transition hover:border-landing-primary/20 hover:bg-landing-primary/5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-landing-primary/10 text-landing-primary">
                      <IconBox icon={safeIcons[place.icon]} size={18} />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">{place.label}</p>
                      {place.count && <p className="text-xs text-slate-400">{place.count} verified nearby</p>}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <GoogleMapView
                  height="240px"
                  center={mapPreview?.center}
                  markers={mapPreview?.markers ?? []}
                  zoom={11}
                />
              </div>
            </div>
            <div className="border-t border-slate-100 px-8 py-4">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-landing-primary hover:gap-3 transition-all"
              >
                Open full map
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div id="travel-guide" className="landing-card p-8">
            <SectionHeader
              eyebrow="Resources"
              title="Travel guide"
              subtitle="Essential information for every destination."
            />
            <div className="grid grid-cols-2 gap-4">
              {travelGuide?.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-100 p-5 transition hover:border-landing-primary/30 hover:shadow-md"
                >
                  <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${guideColors[item.color] ?? 'bg-slate-100 text-slate-600'}`}>
                    <IconBox icon={guideIcons[item.icon]} size={22} />
                  </span>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <a
                    href="#travel-guide"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-landing-primary group-hover:gap-2 transition-all"
                  >
                    {item.subtitle}
                    <FiArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section bg-landing-slate">
        <SectionHeader
          eyebrow="Testimonials"
          title="What travelers say"
          subtitle="Real stories from tourists who travel safer with us."
          action={
            <a href="#contact" className="inline-flex items-center gap-1 text-sm font-semibold text-landing-primary">
              All reviews <FiArrowRight size={16} />
            </a>
          }
        />
        <div className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={() => setTestimonialIndex((i) => Math.max(0, i - 1))}
            disabled={testimonialIndex === 0}
            className="hidden shrink-0 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:bg-white hover:shadow-md disabled:opacity-30 md:flex"
            aria-label="Previous"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="grid flex-1 gap-6 md:grid-cols-3">
            {testimonials.slice(testimonialIndex, testimonialIndex + visibleTestimonials).map((t) => (
              <article key={t.name} className="landing-card p-7">
                <div className="mb-1 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-amber-400 text-amber-400" size={14} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100" />
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">Verified traveler</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTestimonialIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={testimonialIndex >= maxIndex}
            className="hidden shrink-0 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:shadow-md disabled:opacity-30 md:flex"
            aria-label="Next"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section !py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-landing-primary via-blue-600 to-sky-500 px-8 py-16 text-center shadow-glow md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-40" />
          <div className="relative mx-auto max-w-2xl">
            <FiGlobe className="mx-auto mb-4 text-white/80" size={40} />
            <h2 className="text-3xl font-bold text-white md:text-4xl">Start your safe journey today</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of travelers who explore India with real-time safety at their fingertips.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/auth/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-landing-primary shadow-lg transition hover:bg-blue-50">
                Create free account
                <FiArrowRight size={16} />
              </Link>
              <Link to="/auth/login" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                Sign in
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
              {['Free to register', 'No credit card', '24/7 support'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <FiCheckCircle size={14} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

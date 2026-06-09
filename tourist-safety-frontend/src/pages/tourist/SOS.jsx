import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiPhoneCall,
  FiShield,
  FiX,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { useAuth } from '../../hooks/useAuth';
import { safetyService } from '../../services/safetyService';
import { formatDateTime } from '../../utils/formatters';

const EMERGENCY_NUMBERS = [
  { id: 1, name: 'Police', number: '100', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { id: 2, name: 'Ambulance', number: '108', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  { id: 3, name: 'Fire Service', number: '101', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40' },
  { id: 4, name: 'Tourist Helpline', number: '1363', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
];

const STEPS = [
  'Your live GPS location is sent to nearby officers.',
  'An emergency case is created and flagged as critical.',
  'Admins see your alert on the live SOS map.',
  'Keep your phone on — responders may call you.',
];

const defaultPosition = { lat: 15.2993, lng: 74.124 };

export default function SOS() {
  const { user } = useAuth();
  const [phase, setPhase] = useState('idle'); // idle | confirm | sending | sent | error
  const [message, setMessage] = useState('');
  const [statusText, setStatusText] = useState('');
  const [activeSos, setActiveSos] = useState(null);
  const [history, setHistory] = useState([]);
  const [position, setPosition] = useState(defaultPosition);
  const [locationStatus, setLocationStatus] = useState('loading'); // loading | granted | denied

  useEffect(() => {
    safetyService.getSOSHistory().then((data) => {
      const arr = Array.isArray(data) ? data : [];
      setHistory(arr.slice(0, 5));
    });
    safetyService.getActiveSOS().then((data) => {
      const arr = Array.isArray(data) ? data : [];
      const active = arr.find((s) => s.userEmail === user?.email || s.status === 'active');
      setActiveSos(active || null);
      if (active) setPhase('sent');
    });
  }, [user?.email]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      setLocationStatus('denied');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        console.log('Got position:', pos.coords);
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const sendSOS = async () => {
    setPhase('sending');
    setStatusText('');
    try {
      const payload = {
        message: message.trim() || 'Emergency SOS — immediate assistance required',
        location:
          locationStatus === 'granted'
            ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
            : 'Location unavailable',
        lat: position.lat,
        lng: position.lng,
      };
      console.log('Sending SOS payload:', payload);
      const sos = await safetyService.triggerSOS(payload);
      console.log('SOS response:', sos);
      setActiveSos(sos);
      setPhase('sent');
      setStatusText('SOS sent successfully. Officers have been notified with your live location.');
      const updated = await safetyService.getSOSHistory();
      const arr = Array.isArray(updated) ? updated : [];
      setHistory(arr.slice(0, 5));
    } catch (error) {
      console.error('Error sending SOS:', error);
      setPhase('error');
      const errorMsg = error?.response?.data?.message || error?.message || 'Could not send SOS. Check your connection and try again.';
      setStatusText(errorMsg);
    }
  };

  const hasActiveAlert = phase === 'sent' || activeSos?.status === 'active';

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-rose-800/30 bg-gradient-to-br from-rose-700 via-rose-800 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-rose-100">
              <FiAlertTriangle size={16} />
              Emergency response
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">SOS Emergency</h1>
            <p className="mt-2 max-w-2xl text-sm text-rose-100/90">
              One-tap alert broadcasts your live location to safety officers and platform admins.
              Use only in genuine emergencies.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur">
            <FiNavigation size={16} />
            {locationStatus === 'loading' && 'Acquiring GPS location…'}
            {locationStatus === 'granted' && (
              <span>
                Location active — {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
              </span>
            )}
            {locationStatus === 'denied' && 'Location unavailable — enable GPS for best response'}
          </div>
        </div>
      </section>

      {hasActiveAlert && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={22} />
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">Active SOS alert</p>
            <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-300">
              Your emergency signal is live. Officers are tracking your location on the response map.
              {activeSos?.time && ` Sent ${formatDateTime(activeSos.time)}.`}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        {/* SOS trigger panel */}
        <div className="space-y-5 xl:col-span-2">
          <div className="glass-panel overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">Trigger emergency SOS</h2>
              <p className="mt-1 text-sm text-slate-500">
                Confirm before sending — this alerts real responders.
              </p>
            </div>

            <div className="flex flex-col items-center px-5 py-8">
              {phase === 'confirm' ? (
                <div className="w-full space-y-5 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50">
                    <FiAlertTriangle size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Confirm emergency SOS?
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      This will immediately notify officers and share your location.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="danger" onClick={sendSOS} className="gap-2 px-8">
                      <FiAlertTriangle size={16} />
                      Yes, send SOS
                    </Button>
                    <Button variant="outline" onClick={() => setPhase('idle')} className="gap-2">
                      <FiX size={16} />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    {!hasActiveAlert && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/30" />
                    )}
                    <button
                      type="button"
                      disabled={phase === 'sending' || hasActiveAlert}
                      onClick={() => !hasActiveAlert && setPhase('confirm')}
                      className={`relative flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 shadow-elevated transition ${
                        hasActiveAlert
                          ? 'border-emerald-400 bg-emerald-600 text-white'
                          : 'border-rose-300 bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg disabled:opacity-60'
                      }`}
                    >
                      {phase === 'sending' ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : hasActiveAlert ? (
                        <>
                          <FiCheckCircle size={36} />
                          <span className="mt-1 text-xs font-bold uppercase">Active</span>
                        </>
                      ) : (
                        <>
                          <FiAlertTriangle size={40} />
                          <span className="mt-1 text-sm font-bold uppercase tracking-wide">SOS</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                    {phase === 'sending' && 'Sending alert…'}
                    {hasActiveAlert && 'Emergency alert is active'}
                    {phase === 'idle' && 'Tap to start emergency alert'}
                    {phase === 'error' && 'Send failed — tap to try again'}
                  </p>
                </>
              )}

              {statusText && (
                <p
                  className={`mt-4 text-center text-sm font-medium ${
                    phase === 'error' ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {statusText}
                </p>
              )}
            </div>

            {!hasActiveAlert && phase !== 'confirm' && (
              <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                <Textarea
                  label="Additional details (optional)"
                  placeholder="Describe your situation — injury, threat, lost, medical issue…"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  hint="Shared with responding officers."
                />
              </div>
            )}
          </div>

          {/* Emergency numbers */}
          <div className="glass-panel p-5">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <FiPhoneCall size={18} />
              Direct emergency lines
            </h3>
            <p className="mt-1 text-sm text-slate-500">Call local services while SOS is processing</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {EMERGENCY_NUMBERS.map((service) => (
                <a
                  key={service.id}
                  href={`tel:${service.number}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:shadow-sm dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${service.color}`}>
                      <FiPhone size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {service.name}
                      </p>
                      <p className="text-xs text-slate-500">{service.number}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-600">Call</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Map + info */}
        <div className="space-y-5 xl:col-span-3">
          <div className="glass-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Your live location</h3>
                <p className="text-sm text-slate-500">Shared with responders when SOS is triggered</p>
              </div>
              <Link
                to="/tourist/live-tracking"
                className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                Full tracking
              </Link>
            </div>
            <GoogleMapView
              height="380px"
              center={position}
              zoom={14}
              markers={[
                {
                  id: 'you',
                  lat: position.lat,
                  lng: position.lng,
                  label: user?.name ? `${user.name} (you)` : 'Your location',
                  type: 'user',
                },
              ]}
              rounded
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="glass-panel p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white">What happens next</h3>
              <ol className="mt-4 space-y-3">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      {i + 1}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass-panel p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white">Before you send SOS</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <FiShield className="mt-0.5 shrink-0 text-emerald-500" size={14} />
                  Move to a safe, visible location if possible
                </li>
                <li className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 shrink-0 text-brand-500" size={14} />
                  Keep GPS and mobile data enabled
                </li>
                <li className="flex items-start gap-2">
                  <FiPhone className="mt-0.5 shrink-0 text-amber-500" size={14} />
                  <span>
                    Update{' '}
                    <Link to="/tourist/profile" className="font-medium text-brand-600 hover:underline">
                      emergency contact
                    </Link>{' '}
                    in your profile
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <FiClock size={18} />
              Recent SOS history
            </h3>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {item.location || 'Current location'}
                  </p>
                  <p className="text-slate-500">{formatDateTime(item.time)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                    item.status === 'active'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

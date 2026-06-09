import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiInfo,
  FiMapPin,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { tripService } from '../../services/tripService';

const POPULAR_DESTINATIONS = ['Goa', 'Hyderabad', 'Kerala', 'Jaipur', 'Manali', 'Mumbai'];

const TRIP_TYPES = [
  { value: 'leisure', label: 'Leisure & sightseeing' },
  { value: 'adventure', label: 'Adventure & outdoors' },
  { value: 'business', label: 'Business travel' },
  { value: 'family', label: 'Family vacation' },
];

const SAFETY_TIPS = [
  'Enable GeoFence alerts before you depart.',
  'Share live location with trusted contacts.',
  'Save local emergency numbers in your profile.',
  'Review the safety dashboard for your destination.',
];

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="glass-panel overflow-hidden">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function getTripDuration(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return null;
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return days;
}

function buildNotes({ notes, tripType, travelers }) {
  const meta = [];
  const typeLabel = TRIP_TYPES.find((t) => t.value === tripType)?.label;
  if (typeLabel) meta.push(`Type: ${typeLabel}`);
  if (travelers) meta.push(`Travelers: ${travelers}`);

  const trimmed = notes?.trim();
  if (!meta.length) return trimmed || '';
  const header = `[${meta.join(' | ')}]`;
  return trimmed ? `${header}\n${trimmed}` : header;
}

function validateForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Trip title is required.';
  if (!form.destination.trim()) errors.destination = 'Destination is required.';
  if (!form.startDate) errors.startDate = 'Start date is required.';
  if (!form.endDate) errors.endDate = 'End date is required.';
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = 'End date must be on or after the start date.';
  }
  if (form.travelers && (Number(form.travelers) < 1 || Number(form.travelers) > 50)) {
    errors.travelers = 'Enter a number between 1 and 50.';
  }
  return errors;
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    destination: '',
    tripType: 'leisure',
    travelers: '1',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const duration = useMemo(
    () => getTripDuration(form.startDate, form.endDate),
    [form.startDate, form.endDate],
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const trip = await tripService.create({
        title: form.title.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        notes: buildNotes(form),
      });
      navigate('/tourist/my-trips', {
        replace: true,
        state: {
          tripCreated: true,
          trip,
          tripTitle: trip?.title || form.title.trim(),
          destination: trip?.destination || form.destination.trim(),
        },
      });
    } catch {
      setError('Could not create trip. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container">
      <Link
        to="/tourist/my-trips"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <FiArrowLeft size={16} />
        Back to my trips
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Plan your journey</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Create a new trip</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100/90">
            Build your itinerary with safety-aware routing, live tracking, and real-time alerts
            for your destination.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 xl:col-span-2">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}

          <FormSection
            icon={FiCompass}
            title="Trip details"
            description="Give your trip a name and choose the type of travel."
          >
            <Input
              label="Trip title"
              placeholder="e.g. Summer getaway to Goa"
              required
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              error={fieldErrors.title}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Trip type"
                value={form.tripType}
                onChange={(e) => updateField('tripType', e.target.value)}
              >
                {TRIP_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Number of travelers"
                type="number"
                min={1}
                max={50}
                value={form.travelers}
                onChange={(e) => updateField('travelers', e.target.value)}
                error={fieldErrors.travelers}
              />
            </div>
          </FormSection>

          <FormSection
            icon={FiMapPin}
            title="Destination"
            description="Where are you headed? Pick a popular spot or enter your own."
          >
            <Input
              label="Destination"
              placeholder="City, state, or region"
              required
              value={form.destination}
              onChange={(e) => updateField('destination', e.target.value)}
              error={fieldErrors.destination}
            />
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Popular destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => updateField('destination', dest)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                      form.destination === dest
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-950/50 dark:text-brand-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={FiCalendar}
            title="Travel dates"
            description="Set when your trip starts and ends."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start date"
                type="date"
                required
                min={today}
                value={form.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                error={fieldErrors.startDate}
              />
              <Input
                label="End date"
                type="date"
                required
                min={form.startDate || today}
                value={form.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                error={fieldErrors.endDate}
              />
            </div>
            {duration && (
              <p className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                <FiCheckCircle size={16} />
                {duration} day{duration !== 1 ? 's' : ''} planned
              </p>
            )}
          </FormSection>

          <FormSection
            icon={FiInfo}
            title="Additional notes"
            description="Optional details — places to visit, accommodation, or special requirements."
          >
            <Textarea
              label="Itinerary notes"
              placeholder="Add hotel bookings, must-see spots, dietary needs, or anything your travel group should know…"
              rows={5}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              hint="These notes appear on your trip details page."
            />
          </FormSection>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating trip…' : 'Create trip'}
            </Button>
            <Link to="/tourist/my-trips">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-2">
              <FiShield className="text-emerald-500" size={20} />
              <h3 className="font-semibold text-slate-900 dark:text-white">Safety-first planning</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Every trip gets a safety score based on destination risk, active alerts, and
              regional incident data.
            </p>
            <ul className="mt-4 space-y-2.5">
              {SAFETY_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={14} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">What happens next?</h3>
            <ol className="mt-4 space-y-4">
              {[
                { step: '1', text: 'Your trip is saved with a planned status and safety score.' },
                { step: '2', text: 'Enable live tracking when you start traveling.' },
                { step: '3', text: 'Get smart route suggestions and GeoFence alerts on the go.' },
              ].map((item) => (
                <li key={item.step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                    {item.step}
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-panel border-brand-100 bg-brand-50/50 p-5 dark:border-brand-900/50 dark:bg-brand-950/20">
            <div className="flex items-center gap-2">
              <FiUsers className="text-brand-600 dark:text-brand-400" size={18} />
              <h3 className="font-semibold text-slate-900 dark:text-white">Traveling in a group?</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              After creating your trip, use{' '}
              <Link to="/tourist/live-tracking" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                Live Tracking
              </Link>{' '}
              to share your location with companions and emergency contacts.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

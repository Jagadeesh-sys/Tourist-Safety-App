import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell,
  FiCheckCircle,
  FiGlobe,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/formatters';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'te', label: 'Telugu' },
  { value: 'ta', label: 'Tamil' },
  { value: 'kn', label: 'Kannada' },
  { value: 'ml', label: 'Malayalam' },
];

function getInitials(name) {
  if (!name) return 'T';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

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

function ProfileSkeleton() {
  return (
    <div className="page-container animate-pulse space-y-6">
      <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 xl:col-span-2" />
        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function computeCompletion(form) {
  const fields = [
    form.name,
    form.phone,
    form.emergencyContactName,
    form.emergencyContactPhone,
    form.nationality,
  ];
  const filled = fields.filter((f) => f?.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [memberSince, setMemberSince] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    nationality: '',
    preferredLanguage: 'en',
  });

  useEffect(() => {
    userService
      .getProfile()
      .then((profile) => {
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          emergencyContactName: profile.emergencyContactName || '',
          emergencyContactPhone: profile.emergencyContactPhone || '',
          nationality: profile.nationality || '',
          preferredLanguage: profile.preferredLanguage || 'en',
        });
        setMemberSince(profile.memberSince);
      })
      .catch(() => {
        setForm({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          nationality: '',
          preferredLanguage: 'en',
        });
      })
      .finally(() => setLoading(false));
  }, [user?.email, user?.name, user?.phone]);

  const completion = useMemo(() => computeCompletion(form), [form]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const updated = await userService.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        emergencyContactName: form.emergencyContactName.trim(),
        emergencyContactPhone: form.emergencyContactPhone.trim(),
        nationality: form.nationality.trim(),
        preferredLanguage: form.preferredLanguage,
      });
      updateUser({ name: updated.name, phone: updated.phone });
      setSuccess('Profile updated successfully.');
    } catch {
      setError('Could not save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="page-container">
      {/* Profile hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-2 ring-white/20 backdrop-blur">
            {getInitials(form.name || user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-brand-100">Your account</p>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight md:text-3xl">
              {form.name || 'Traveler'}
            </h1>
            <p className="mt-1 truncate text-sm text-brand-100/90">{form.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {user?.role || 'TOURIST'}
              </span>
              {memberSince && (
                <span className="text-xs text-brand-100/80">
                  Member since {formatDate(memberSince)}
                </span>
              )}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-medium text-brand-100">Profile completion</p>
            <p className="mt-1 text-3xl font-bold">{completion}%</p>
            <div className="mt-2 h-2 w-full min-w-[120px] overflow-hidden rounded-full bg-white/20 sm:ml-auto sm:w-32">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 xl:col-span-2">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              <FiCheckCircle size={16} />
              {success}
            </div>
          )}

          <FormSection
            icon={FiUser}
            title="Personal information"
            description="Update your name and contact details."
          >
            <Input
              label="Full name"
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your full name"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email address"
                type="email"
                value={form.email}
                disabled
                hint="Email cannot be changed"
              />
              <Input
                label="Phone number"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nationality"
                value={form.nationality}
                onChange={(e) => updateField('nationality', e.target.value)}
                placeholder="e.g. Indian"
              />
              <Select
                label="Preferred language"
                value={form.preferredLanguage}
                onChange={(e) => updateField('preferredLanguage', e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </Select>
            </div>
          </FormSection>

          <FormSection
            icon={FiPhone}
            title="Emergency contact"
            description="Someone we can reach if you trigger SOS or need assistance."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Contact name"
                value={form.emergencyContactName}
                onChange={(e) => updateField('emergencyContactName', e.target.value)}
                placeholder="e.g. Parent or spouse"
              />
              <Input
                label="Contact phone"
                type="tel"
                value={form.emergencyContactPhone}
                onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <FiShield className="mt-0.5 shrink-0" size={14} />
              Keep this up to date — it is used during SOS alerts and safety notifications.
            </p>
          </FormSection>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
            <Link to="/tourist/dashboard">
              <Button type="button" variant="outline">
                Back to dashboard
              </Button>
            </Link>
          </div>
        </form>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Account summary</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800">
                  <FiMail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {form.email}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800">
                  <FiPhone size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {form.phone || 'Not set'}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800">
                  <FiGlobe size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Language</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {LANGUAGES.find((l) => l.value === form.preferredLanguage)?.label || 'English'}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Safety checklist</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { done: !!form.phone, label: 'Add your phone number' },
                { done: !!form.emergencyContactPhone, label: 'Set emergency contact' },
                { done: !!form.nationality, label: 'Add nationality' },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <FiCheckCircle
                    size={16}
                    className={item.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}
                  />
                  <span
                    className={
                      item.done
                        ? 'text-slate-600 line-through dark:text-slate-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick links</h3>
            <div className="mt-4 space-y-2">
              <Link
                to="/tourist/notifications"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
              >
                <FiBell className="text-brand-500" size={18} />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Notification preferences
                </span>
              </Link>
              <Link
                to="/tourist/safety"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
              >
                <FiShield className="text-emerald-500" size={18} />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Safety dashboard
                </span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

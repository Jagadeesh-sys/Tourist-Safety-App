import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiMessageSquare,
  FiShield,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { safetyService } from '../../services/safetyService';

const INCIDENT_TYPES = [
  { value: 'theft', label: 'Theft or loss of property' },
  { value: 'harassment', label: 'Harassment or inappropriate behavior' },
  { value: 'accident', label: 'Accident or injury' },
  { value: 'medical', label: 'Medical emergency (non-life-threatening)' },
  { value: 'traffic', label: 'Traffic incident' },
  { value: 'other', label: 'Other safety concern' },
];

const REPORTING_TIPS = [
  'Provide as much detail as possible about the incident.',
  'Include the exact location and time when it occurred.',
  'Consider adding photos or screenshots as evidence (future feature).',
  'For immediate emergencies, use the SOS button instead of this form.',
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

function validateForm(form) {
  const errors = {};
  if (!form.type) errors.type = 'Please select an incident type.';
  if (!form.location.trim()) errors.location = 'Location is required.';
  if (!form.occurredAt) errors.occurredAt = 'Date and time are required.';
  if (!form.description.trim()) errors.description = 'Please provide a description.';
  return errors;
}

export default function ReportIncident() {
  const [form, setForm] = useState({
    type: 'theft',
    location: '',
    occurredAt: '',
    description: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await safetyService.reportIncident(form);
      setSuccess('Incident reported successfully! Local authorities have been notified.');
      setForm({
        type: 'theft',
        location: '',
        occurredAt: '',
        description: '',
      });
    } catch {
      setError('Could not submit report. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const now = new Date().toISOString().slice(0, 16); // Format for datetime-local

  return (
    <div className="page-container">
      <Link
        to="/tourist/safety-dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <FiArrowLeft size={16} />
        Back to safety dashboard
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-rose-700/20 bg-gradient-to-br from-rose-600 via-rose-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-rose-100">Safety reporting</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Report an incident</h1>
          <p className="mt-2 max-w-2xl text-sm text-rose-100/90">
            For urgent emergencies, use the SOS button immediately. This form is for non-life-threatening safety issues that require follow-up.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 xl:col-span-2">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <div className="flex items-center gap-2">
                <FiAlertCircle size={16} />
                {error}
              </div>
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <FiCheckCircle size={16} />
                {success}
              </div>
            </div>
          )}

          <FormSection
            icon={FiAlertCircle}
            title="Incident details"
            description="Tell us what happened and when."
          >
            <Select
              label="Incident type"
              required
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
              error={fieldErrors.type}
            >
              {INCIDENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date & time"
                type="datetime-local"
                required
                max={now}
                value={form.occurredAt}
                onChange={(e) => updateField('occurredAt', e.target.value)}
                error={fieldErrors.occurredAt}
                hint="When did the incident occur?"
              />
              <Input
                label="Location"
                placeholder="City, landmark, or address"
                required
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                error={fieldErrors.location}
              />
            </div>
          </FormSection>

          <FormSection
            icon={FiMessageSquare}
            title="Description"
            description="Provide details about what happened."
          >
            <Textarea
              label="What happened?"
              placeholder="Describe the incident in detail. Include what you saw, who was involved, and any other relevant information…"
              rows={6}
              required
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              error={fieldErrors.description}
              hint="The more details you provide, the better we can assist you."
            />
          </FormSection>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting report…' : 'Submit report'}
            </Button>
            <Link to="/tourist/safety-dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="glass-panel border-rose-100 bg-rose-50/50 p-5 dark:border-rose-900/50 dark:bg-rose-950/20">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-rose-600 dark:text-rose-400" size={20} />
              <h3 className="font-semibold text-slate-900 dark:text-white">Immediate emergency?</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              If you are in immediate danger or experiencing a life-threatening emergency, please use the SOS button or call local emergency services.
            </p>
            <Link to="/tourist/sos" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition">
              <FiShield size={16} />
              Open SOS
            </Link>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Reporting tips</h3>
            <ul className="mt-4 space-y-2.5">
              {REPORTING_TIPS.map((tip) => (
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
                { step: '1', text: 'Your report is sent to local safety officers.' },
                { step: '2', text: 'You receive updates on the status of your report.' },
                { step: '3', text: 'Safety officers may follow up for more details.' },
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
        </aside>
      </div>
    </div>
  );
}

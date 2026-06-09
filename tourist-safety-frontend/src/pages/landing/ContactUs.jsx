import { useState } from 'react';
import LandingLayout from './LandingLayout';
import { FiPhone, FiMail, FiMapPin, FiCheckCircle } from 'react-icons/fi';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <LandingLayout title="Contact Us">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
          <p className="text-slate-600 mb-8">
            Have questions or need help? Our support team is here for you 24/7.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-primary/10 text-landing-primary">
                <FiPhone size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone</h3>
                <p className="text-slate-600">+91 1800 123 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-primary/10 text-landing-primary">
                <FiMail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-600">support@touristsafety.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-primary/10 text-landing-primary">
                <FiMapPin size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Address</h3>
                <p className="text-slate-600">123 Travel Street, Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <FiCheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-xl font-bold text-green-800">Thank You!</h3>
              <p className="text-green-700 mt-2">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-landing-primary focus:ring-2 focus:ring-landing-primary/20 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-landing-primary focus:ring-2 focus:ring-landing-primary/20 outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-landing-primary focus:ring-2 focus:ring-landing-primary/20 outline-none resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-landing-primary px-6 py-3 text-sm font-bold text-white hover:bg-landing-primary/90 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </LandingLayout>
  );
}

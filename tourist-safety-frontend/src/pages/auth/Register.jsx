import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { authService } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Success Message
      setSuccess('✓ Registration Successful! Redirecting to login...');

      // Clear form
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
        <FiChevronLeft size={16} />
        Back to Home
      </Link>
      <h2 className="text-3xl font-bold text-center">
        Create Account
      </h2>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 flex items-center gap-2 shadow-sm">
          <span className="text-xl font-bold">✓</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-semibold text-brand-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
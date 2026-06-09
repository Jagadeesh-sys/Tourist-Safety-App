import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { resolveRoleHomePath } from '../../utils/navigation';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Login button clicked');

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await login(form);

      console.log('Login Success');
      console.log('User:', user);

      setSuccess('✓ Login Successful!');

      // Navigate to correct dashboard based on user role
      navigate(resolveRoleHomePath(user), { replace: true });

    } catch (err) {
      console.error('Login Error:', err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Invalid email or password.'
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
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-slate-500">
          Sign in to your Travel & Safety Dashboard.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold text-slate-900 dark:text-white">
          🚀 Demo Credentials:
        </p>
        <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <p><strong>Admin:</strong> admin@touristsafety.com / admin123</p>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-brand-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage('If an account exists, a reset link has been sent.');
    } catch {
      setMessage('Request received. Check your email when the backend is connected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h2 className="text-3xl font-bold">Forgot password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        <Button type="submit" className="w-full" disabled={loading}>Send reset link</Button>
      </form>
      <Link to="/auth/login" className="text-sm font-medium text-brand-600">Back to login</Link>
    </div>
  );
}

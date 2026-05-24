import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api.js';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.error || 'Password reset failed';
      const details = err.response?.data?.details;
      setError(details ? Object.values(details).flat().join('; ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <h1>Reset Password</h1>
          <div className="auth-error">Missing reset token. Please check your reset link.</div>
          <p className="auth-links">
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        {!message && (
          <>
            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
        <p className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

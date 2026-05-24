import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch {
      setMessage('If an account with that email exists, a reset link has been sent.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        {message && <div className="auth-success">{message}</div>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>
        <p className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

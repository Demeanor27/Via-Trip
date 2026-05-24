import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import FeatureBar from '../Layout/FeatureBar.jsx';
import Footer from '../Layout/Footer.jsx';

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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md border border-[#E0DED6] p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500 font-bold">V</div>
            </div>
            <h1 className="text-2xl font-bold text-brand-700 text-center mb-1">Forgot Password</h1>
            <p className="text-sm text-muted text-center mb-6">
              No worries! Enter your email and
              <br />we&apos;ll send you a link to reset your password
            </p>
            {message && (
              <div className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg mb-4">{message}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Email</label>
                <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                  <span className="text-[#8A8A78] text-sm mr-2">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-500 text-white font-semibold rounded-[12px] hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <div className="flex items-start gap-3 bg-[#EDF5E4] border border-[#C8DFA8] rounded-lg p-4 mt-4">
              <span className="text-brand-500 text-sm mt-0.5">&#128737;</span>
              <p className="text-xs text-brand-600">
                For your security, the reset link will expire in 15 minutes
              </p>
            </div>
            <Link
              to="/login"
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              &larr; Back to Log In
            </Link>
          </div>
        </div>
      </div>
      <FeatureBar />
      <Footer />
    </div>
  );
}

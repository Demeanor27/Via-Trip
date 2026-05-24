import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import FeatureBar from '../Layout/FeatureBar.jsx';
import Footer from '../Layout/Footer.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
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
            <h1 className="text-2xl font-bold text-brand-700 text-center mb-1">Log In</h1>
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Email</label>
                <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                  <span className="text-[#8A8A78] text-sm mr-2">@</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Password</label>
                <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                  <span className="text-[#8A8A78] text-sm mr-2">&#128273;</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#8A8A78] text-sm ml-2"
                  >
                    {showPassword ? 'hide' : 'show'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#4A4A3A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-[#D8D6CC] text-brand-500 focus:ring-brand-500"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="font-semibold text-brand-500 hover:text-brand-600">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-500 text-white font-semibold rounded-[12px] hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Signing in...' : 'Log In'}
              </button>
            </form>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E0DED6]" />
              <span className="text-xs text-[#A8A898]">Or continue with</span>
              <div className="flex-1 h-px bg-[#E0DED6]" />
            </div>
            <div className="flex gap-3">
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Google
              </button>
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Facebook
              </button>
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Apple
              </button>
            </div>
            <p className="text-center text-sm text-muted mt-5">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600">
                Register now &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
      <FeatureBar />
      <Footer />
    </div>
  );
}

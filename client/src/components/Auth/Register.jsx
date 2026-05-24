import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import FeatureBar from '../Layout/FeatureBar.jsx';
import Footer from '../Layout/Footer.jsx';

const roles = [
  {
    value: 'traveler',
    label: 'Traveler',
    desc: 'Plan trips, discover places, and collect memories',
    icon: '#',
  },
  {
    value: 'place_owner',
    label: 'Place Owner',
    desc: 'Add and manage your place information',
    icon: '#',
  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'traveler',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      const details = err.response?.data?.details;
      setError(details ? Object.values(details).flat().join('; ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl shadow-md border border-[#E0DED6] p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500 font-bold">V</div>
            </div>
            <h1 className="text-2xl font-bold text-brand-700 text-center mb-1">Create Your Account</h1>
            <p className="text-sm text-muted text-center mb-6">Let&apos;s get you started on your journey</p>
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Name</label>
                  <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                    <span className="text-[#8A8A78] text-sm mr-2">&#128100;</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                    />
                  </div>
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Password</label>
                  <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                    <span className="text-[#8A8A78] text-sm mr-2">&#128273;</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Create a password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                    />
                  </div>
                  <span className="block text-xs text-[#A8A898] mt-1">At least 8 characters</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Confirm password</label>
                  <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                    <span className="text-[#8A8A78] text-sm mr-2">&#128273;</span>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      required
                      autoComplete="new-password"
                      className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D3D30] mb-2">I am a ...</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        form.role === r.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-[#E0DED6] hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={form.role === r.value}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="mt-0.5 text-brand-500 focus:ring-brand-500"
                      />
                      <div>
                        <span className="block text-xs text-[#8A8A78] mb-1">{r.icon}</span>
                        <span className="block text-sm font-semibold text-[#2D2D20]">{r.label}</span>
                        <span className="block text-xs text-muted">{r.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-500 text-white font-semibold rounded-[12px] hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Creating account...' : 'Register'}
              </button>
            </form>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E0DED6]" />
              <span className="text-xs text-[#A8A898]">Or</span>
              <div className="flex-1 h-px bg-[#E0DED6]" />
            </div>
            <div className="flex gap-3">
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Continue with Google
              </button>
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Continue with Facebook
              </button>
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Continue with Apple
              </button>
            </div>
            <p className="text-center text-sm text-muted mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">
                Log in &rarr;
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

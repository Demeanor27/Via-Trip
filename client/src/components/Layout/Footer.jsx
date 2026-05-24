import { Link } from 'react-router-dom';

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/blog', label: 'Blog' },
];

const supportLinks = [
  { to: '/help', label: 'Help Center' },
  { to: '/terms', label: 'Term Of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/faqs', label: 'FAQs' },
];

function FullFooter() {
  return (
    <footer className="bg-white border-t border-[#E8E6DE] px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-brand-50 rounded flex items-center justify-center text-brand-500 font-bold text-sm">V</div>
            <div>
              <span className="font-bold text-brand-700">Via-Trip</span>
              <span className="block text-xs text-brand-400">Journey your way</span>
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Via-Trip helps you plan the perfect road trips, discover amazing places,
            and create unforgettable memories
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[#2D2D20] mb-3">COMPANY</h4>
          <ul className="space-y-2">
            {companyLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-[#4A4A3A] hover:text-brand-500 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[#2D2D20] mb-3">SUPPORT</h4>
          <ul className="space-y-2">
            {supportLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-[#4A4A3A] hover:text-brand-500 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[#2D2D20] mb-3">FOLLOW US</h4>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-accent-light rounded flex items-center justify-center text-brand-500 text-sm font-bold">f</div>
            <div className="w-8 h-8 bg-accent-light rounded flex items-center justify-center text-brand-500 text-sm font-bold">t</div>
            <div className="w-8 h-8 bg-accent-light rounded flex items-center justify-center text-brand-500 text-sm font-bold">i</div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#E8E6DE] text-center text-xs text-muted">
        &copy;2026 Via-Trip. All rights reserved.
      </div>
    </footer>
  );
}

function HomeFooter() {
  return (
    <footer className="bg-white border-t border-[#E8E6DE] px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted">&copy;2026 Via-Trip. All rights reserved.</span>
        <div className="flex items-center gap-4 text-xs text-[#4A4A3A]">
          <Link to="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-brand-500 transition-colors">Contact Us</Link>
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-accent-light rounded flex items-center justify-center text-brand-500 text-xs font-bold">f</div>
          <div className="w-6 h-6 bg-accent-light rounded flex items-center justify-center text-brand-500 text-xs font-bold">t</div>
          <div className="w-6 h-6 bg-accent-light rounded flex items-center justify-center text-brand-500 text-xs font-bold">i</div>
        </div>
      </div>
    </footer>
  );
}

export default function Footer({ variant = 'full' }) {
  return variant === 'home' ? <HomeFooter /> : <FullFooter />;
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    navigate('/trips/new');
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pt-8 pb-6">
      <div className="bg-gradient-to-br from-[#C8D8B0] to-[#B8CFA0] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-700 leading-tight mb-4">
            Every Route Has a Story
          </h1>
          <p className="text-muted text-base md:text-lg mb-6 leading-relaxed">
            Plan your trip, discovery hidden gems,
            <br />and collect memories along the way
          </p>
          <form onSubmit={handleSubmit} className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Origin</label>
                <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                  <span className="text-[#8A8A78] text-sm mr-2">&#9906;</span>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Where are you starting?"
                    className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="mt-5 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <span className="text-[#4A4A3A] text-sm">&#8644;</span>
              </button>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#3D3D30] mb-1">Destination</label>
                <div className="flex items-center border border-[#D8D6CC] rounded-lg px-3 py-2 focus-within:ring-[3px] focus-within:ring-[rgba(74,124,47,0.15)] focus-within:border-brand-500 transition-all">
                  <span className="text-[#8A8A78] text-sm mr-2">&#9906;</span>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full text-sm outline-none bg-transparent placeholder:text-[#A8A898]"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-500 text-white font-semibold rounded-[12px] hover:bg-brand-600 transition-colors"
            >
              Start Planning
            </button>
          </form>
        </div>
        <div className="flex-1 w-full">
          <div className="w-full aspect-[4/3] bg-[#C8B896] rounded-xl flex items-center justify-center">
            <span className="text-white/60 text-4xl font-light">&times;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

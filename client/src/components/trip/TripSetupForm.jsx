import { useState } from 'react';
import TravelStyleSelector from './TravelStyleSelector.jsx';

export default function TripSetupForm({ onCalculateRoute, loading }) {
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    travel_style: 'chill',
    total_days: 1,
    corridor_width_km: 10,
    travel_date: '',
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.origin || !form.destination) return;
    onCalculateRoute(form);
  };

  return (
    <form className="bg-white rounded-xl shadow-sm border border-[#E0DED6] p-6 mb-6 space-y-4" onSubmit={handleSubmit}>
      <div className="flex gap-4 flex-wrap">
        <label className="flex-1 min-w-[200px] font-medium text-sm text-[#3D3D30]">
          Origin
          <input id="origin-input" type="text" value={form.origin}
            onChange={(e) => set('origin', e.target.value)}
            placeholder="Search place or city" required
            className="block w-full mt-1 px-3 py-2 border border-[#D8D6CC] rounded-lg text-sm outline-none focus:ring-[3px] focus:ring-[rgba(74,124,47,0.15)] focus:border-brand-500 placeholder:text-[#A8A898]" />
        </label>
        <label className="flex-1 min-w-[200px] font-medium text-sm text-[#3D3D30]">
          Destination
          <input id="destination-input" type="text" value={form.destination}
            onChange={(e) => set('destination', e.target.value)}
            placeholder="Search place or city" required
            className="block w-full mt-1 px-3 py-2 border border-[#D8D6CC] rounded-lg text-sm outline-none focus:ring-[3px] focus:ring-[rgba(74,124,47,0.15)] focus:border-brand-500 placeholder:text-[#A8A898]" />
        </label>
      </div>

      <TravelStyleSelector value={form.travel_style} onChange={(v) => set('travel_style', v)} />

      <div className="flex gap-4 flex-wrap">
        <label className="flex-1 min-w-[160px] font-medium text-sm text-[#3D3D30]">
          Travel Date
          <input type="date" value={form.travel_date}
            onChange={(e) => set('travel_date', e.target.value)}
            className="block w-full mt-1 px-3 py-2 border border-[#D8D6CC] rounded-lg text-sm outline-none focus:ring-[3px] focus:ring-[rgba(74,124,47,0.15)] focus:border-brand-500" />
        </label>
        <label className="flex-1 min-w-[100px] font-medium text-sm text-[#3D3D30]">
          Days
          <input type="number" min="1" max="30" value={form.total_days}
            onChange={(e) => set('total_days', parseInt(e.target.value) || 1)}
            className="block w-full mt-1 px-3 py-2 border border-[#D8D6CC] rounded-lg text-sm outline-none focus:ring-[3px] focus:ring-[rgba(74,124,47,0.15)] focus:border-brand-500" />
        </label>
        <label className="flex-1 min-w-[200px] font-medium text-sm text-[#3D3D30]">
          Corridor (km)
          <div className="flex items-center gap-2 mt-1">
            <input type="range" min="1" max="50" value={form.corridor_width_km}
              onChange={(e) => set('corridor_width_km', parseInt(e.target.value))}
              className="flex-1 accent-brand-500" />
            <span className="font-semibold text-brand-500 min-w-[3rem]">{form.corridor_width_km} km</span>
          </div>
        </label>
      </div>

      <button type="submit" disabled={loading || !form.origin || !form.destination}
        className="w-full py-3 bg-brand-500 text-white font-semibold rounded-[12px] hover:bg-brand-600 disabled:opacity-50 transition-colors">
        {loading ? 'Calculating...' : 'Calculate Route'}
      </button>
    </form>
  );
}

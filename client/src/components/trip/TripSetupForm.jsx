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
    <form className="trip-setup-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Origin
          <input id="origin-input" type="text" value={form.origin}
            onChange={(e) => set('origin', e.target.value)}
            placeholder="Search place or city" required />
        </label>
        <label>
          Destination
          <input id="destination-input" type="text" value={form.destination}
            onChange={(e) => set('destination', e.target.value)}
            placeholder="Search place or city" required />
        </label>
      </div>

      <TravelStyleSelector value={form.travel_style} onChange={(v) => set('travel_style', v)} />

      <div className="form-row">
        <label>
          Travel Date
          <input type="date" value={form.travel_date}
            onChange={(e) => set('travel_date', e.target.value)} />
        </label>
        <label>
          Days
          <input type="number" min="1" max="30" value={form.total_days}
            onChange={(e) => set('total_days', parseInt(e.target.value) || 1)} />
        </label>
        <label>
          Corridor (km)
          <div className="corridor-input">
            <input type="range" min="1" max="50" value={form.corridor_width_km}
              onChange={(e) => set('corridor_width_km', parseInt(e.target.value))} />
            <span>{form.corridor_width_km} km</span>
          </div>
        </label>
      </div>

      <button type="submit" disabled={loading || !form.origin || !form.destination}>
        {loading ? 'Calculating...' : 'Calculate Route'}
      </button>
    </form>
  );
}

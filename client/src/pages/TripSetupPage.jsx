import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import MapContainer from '../components/map/MapContainer.jsx';
import TripSetupForm from '../components/trip/TripSetupForm.jsx';
import TripRouteInfo from '../components/trip/TripRouteInfo.jsx';

export default function TripSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCalculateRoute = async (form) => {
    setLoading(true);
    setError('');
    setFormData(form);
    try {
      const res = await api.post('/trips/directions', {
        origin: form.origin,
        destination: form.destination,
      });
      const d = res.data.route;
      setOrigin({ lat: d.originLat, lng: d.originLng, name: d.originAddress });
      setDestination({ lat: d.destLat, lng: d.destLng, name: d.destinationAddress });
      setRoute(d);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!route || !formData) return;
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/trips', {
        title: `${formData.origin} → ${formData.destination}`,
        travel_style: formData.travel_style || 'chill',
        travel_date: formData.travel_date || undefined,
        total_days: formData.total_days || 1,
        origin_name: origin.name,
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        destination_name: destination.name,
        destination_lat: destination.lat,
        destination_lng: destination.lng,
        corridor_width_km: formData.corridor_width_km || 10,
        route_geometry: route.routeGeometry,
        route_distance_m: route.distanceM,
        route_duration_s: route.durationS,
      });
      navigate(`/trips/${res.data.trip.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trip-setup-page">
      <h1>Plan Your Trip</h1>
      {error && <div className="auth-error">{error}</div>}

      <TripSetupForm onCalculateRoute={handleCalculateRoute} loading={loading} />

      <MapContainer
        origin={origin}
        destination={destination}
        routeGeometry={route?.routeGeometry}
      />

      {route && <TripRouteInfo route={route} />}

      {route && user && (
        <div className="save-trip-bar">
          <button onClick={handleSaveTrip} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Trip'}
          </button>
        </div>
      )}
    </div>
  );
}

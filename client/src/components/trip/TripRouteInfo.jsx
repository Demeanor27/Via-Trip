export default function TripRouteInfo({ route }) {
  if (!route) return null;

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const formatDistance = (m) => {
    if (m > 1000) return `${(m / 1000).toFixed(1)} km`;
    return `${m} m`;
  };

  return (
    <div className="trip-route-info">
      <div className="info-card">
        <span className="info-label">Distance</span>
        <span className="info-value">{formatDistance(route.distanceM)}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Driving Time</span>
        <span className="info-value">{formatDuration(route.durationS)}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Origin</span>
        <span className="info-value small">{route.originAddress}</span>
      </div>
      <div className="info-card">
        <span className="info-label">Destination</span>
        <span className="info-value small">{route.destinationAddress}</span>
      </div>
    </div>
  );
}

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
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[140px] bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Distance</span>
        <span className="text-lg font-semibold text-gray-800">{formatDistance(route.distanceM)}</span>
      </div>
      <div className="flex-1 min-w-[140px] bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Driving Time</span>
        <span className="text-lg font-semibold text-gray-800">{formatDuration(route.durationS)}</span>
      </div>
      <div className="flex-1 min-w-[140px] bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Origin</span>
        <span className="text-sm text-gray-600">{route.originAddress}</span>
      </div>
      <div className="flex-1 min-w-[140px] bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Destination</span>
        <span className="text-sm text-gray-600">{route.destinationAddress}</span>
      </div>
    </div>
  );
}

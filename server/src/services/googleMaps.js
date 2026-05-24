import env from '../config/env.js';

export async function getDirections(origin, destination) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${env.GOOGLE_MAPS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error(`Directions API error: ${data.status}`);
  }

  const route = data.routes[0];
  const leg = route.legs[0];

  return {
    routeGeometry: route.overview_polyline.points,
    distanceM: leg.distance.value,
    durationS: leg.duration.value,
    originLat: leg.start_location.lat,
    originLng: leg.start_location.lng,
    destLat: leg.end_location.lat,
    destLng: leg.end_location.lng,
    originAddress: leg.start_address,
    destinationAddress: leg.end_address,
  };
}

export async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos,rating,types&key=${env.GOOGLE_MAPS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error(`Places API error: ${data.status}`);
  }

  return data.result;
}

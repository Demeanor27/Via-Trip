import { useEffect, useRef, useCallback, useState } from 'react';
import { loadGoogleMaps } from '../../services/mapsService.js';

export default function MapContainer({ origin, destination, routeGeometry, onMapClick, onOriginSelect, onDestSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const originMarker = useRef(null);
  const destMarker = useRef(null);
  const routePolyline = useRef(null);
  const autocompleteOrigin = useRef(null);
  const autocompleteDest = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoogleMaps()
      .then((google) => {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 13.736717, lng: 100.523186 },
          zoom: 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        map.addListener('click', (e) => {
          if (onMapClick) onMapClick(e.latLng.lat(), e.latLng.lng());
        });

        mapInstance.current = map;
        setMapReady(true);
      })
      .catch(() => setError('Failed to load Google Maps'));
  }, [onMapClick]);

  useEffect(() => {
    if (!mapReady) return;
    const google = window.google;

    const originInput = document.getElementById('origin-input');
    const destInput = document.getElementById('destination-input');

    if (originInput && !autocompleteOrigin.current) {
      autocompleteOrigin.current = new google.maps.places.Autocomplete(originInput, { types: ['geocode'] });
      autocompleteOrigin.current.addListener('place_changed', () => {
        const place = autocompleteOrigin.current.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          if (onOriginSelect) onOriginSelect(place.formatted_address, lat, lng);
          mapInstance.current.setCenter(place.geometry.location);
          mapInstance.current.setZoom(8);
        }
      });
    }

    if (destInput && !autocompleteDest.current) {
      autocompleteDest.current = new google.maps.places.Autocomplete(destInput, { types: ['geocode'] });
      autocompleteDest.current.addListener('place_changed', () => {
        const place = autocompleteDest.current.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          if (onDestSelect) onDestSelect(place.formatted_address, lat, lng);
          mapInstance.current.setCenter(place.geometry.location);
          mapInstance.current.setZoom(8);
        }
      });
    }
  }, [mapReady, onOriginSelect, onDestSelect]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    const google = window.google;

    if (originMarker.current) originMarker.current.setMap(null);
    if (origin) {
      originMarker.current = new google.maps.Marker({
        position: { lat: origin.lat, lng: origin.lng },
        map: mapInstance.current,
        label: 'A',
        title: 'Origin',
      });
    }
  }, [mapReady, origin]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    const google = window.google;

    if (destMarker.current) destMarker.current.setMap(null);
    if (destination) {
      destMarker.current = new google.maps.Marker({
        position: { lat: destination.lat, lng: destination.lng },
        map: mapInstance.current,
        label: 'B',
        title: 'Destination',
      });
      if (origin) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: origin.lat, lng: origin.lng });
        bounds.extend({ lat: destination.lat, lng: destination.lng });
        mapInstance.current.fitBounds(bounds);
      }
    }
  }, [mapReady, origin, destination]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current || !routeGeometry) return;
    const google = window.google;

    if (routePolyline.current) routePolyline.current.setMap(null);

    const path = google.maps.geometry.encoding.decodePath(routeGeometry);
    routePolyline.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#4A7C2F',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: mapInstance.current,
    });
  }, [mapReady, routeGeometry]);

  if (error) return <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>;

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-6">
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
}

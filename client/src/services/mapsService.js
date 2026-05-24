let mapsLoaded = false;
let loadPromise = null;

export function loadGoogleMaps() {
  if (mapsLoaded) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry`;
    script.async = true;
    script.onload = () => {
      mapsLoaded = true;
      resolve(window.google);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return loadPromise;
}

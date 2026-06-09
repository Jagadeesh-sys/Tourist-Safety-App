import { useEffect, useState } from 'react';
import GoogleMapView from './GoogleMapView';

export default function LiveTrackingMap() {
  const [position, setPosition] = useState({ lat: 15.2993, lng: 74.124 });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <GoogleMapView
      center={position}
      markers={[{ id: 'you', lat: position.lat, lng: position.lng, label: 'Your location' }]}
      height="420px"
    />
  );
}

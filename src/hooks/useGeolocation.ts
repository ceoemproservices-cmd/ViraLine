import { useState, useEffect } from 'react';
import { Location } from '../types';

interface GeolocationState {
  location: Location | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ location: { lat: 51.5074, lng: -0.1278 }, error: 'Not supported', loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      () => {
        setState({ location: { lat: 51.5074, lng: -0.1278 }, error: 'Permission denied', loading: false });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return state;
}
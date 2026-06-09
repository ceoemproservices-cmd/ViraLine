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
      setState({ 
        location: { lat: 51.5074, lng: -0.1278 }, 
        error: 'Not supported', 
        loading: false 
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('GPS Success:', pos.coords.latitude, pos.coords.longitude);
        setState({
          location: { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude 
          },
          error: null,
          loading: false,
        });
      },
      (err) => {
        console.log('GPS Error:', err.message);
        setState({ 
          location: { lat: 51.5074, lng: -0.1278 }, 
          error: err.message, 
          loading: false 
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  return state;
}
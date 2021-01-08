import { useState, useEffect } from 'react';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

interface IPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export const usePosition = (settings = defaultSettings): { position: IPosition; error: string } => {
  const [position, setPosition] = useState<IPosition>();
  const [error, setError] = useState('');

  const onChange = ({ coords, timestamp }: { coords: GeolocationCoordinates; timestamp: number }): void => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp,
    });
  };

  const onError = (error: GeolocationPositionError): void => {
    setError(error.message);
  };

  useEffect((): void => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported');
    }
    navigator.geolocation.getCurrentPosition(onChange, onError, settings);
  }, [settings]);

  return { position, error };
};

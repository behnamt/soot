import { useState, useEffect } from 'react';
import { IPosition, GeolocationCoordinates, GeolocationPositionError } from '@interfaces/IPosition';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

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

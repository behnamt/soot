import { useState, useEffect } from 'react';
import { ILocation, GeolocationCoordinates, GeolocationPositionError } from '@soot/core/dist/@types/IPosition';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

export const usePosition = (settings = defaultSettings): { position: ILocation; error: string } => {
  const [position, setPosition] = useState<ILocation>();
  const [error, setError] = useState('');

  const onChange = ({ coords }: { coords: GeolocationCoordinates }): void => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
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

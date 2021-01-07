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

  const onChange = ({ coords, timestamp }: { coords: any; timestamp: number }): void => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp,
    });
  };

  const onError = (error: PositionError): void => {
    setError(error.message);
  };

  useEffect((): void => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported');
    }
    navigator.geolocation.getCurrentPosition(onChange, onError, settings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return { position, error };
};

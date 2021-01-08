import React, { useRef, useEffect, useState } from 'react';
import { loadBingApi, Microsoft } from '../../lib/services/BingApi';

export interface IMark {
  draggable?: boolean;
  name: string;
  id: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface IMapProps {
  mapOptions?: any;
  marks: IMark[] | undefined;
  height?: string;
}

interface IBingMap {
  entities: any[];
}

export const BingMap: React.FC<IMapProps> = (props: IMapProps) => {
  const { mapOptions, marks, height = '80vh' } = props;

  const mapRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<IBingMap | null>(null);

  const initMap = () => {
    const map = new Microsoft.Maps.Map(mapRef.current);
    if (mapOptions) {
      map.setOptions(mapOptions);
    }

    return map;
  };

  useEffect(() => {
    (async () => {
      await loadBingApi();
      setMap(initMap());
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map && marks?.length) {
      marks.forEach((mark) => {
        const loc = new Microsoft.Maps.Location(mark.location.lat, mark.location.lng);
        const pin = new Microsoft.Maps.Pushpin(loc, {
          title: mark.name,
          text: mark.id,
          draggable: mark.draggable,
        });

        //Add the pushpin to the map
        map!.entities.push(pin);
      });
    }
  }, [map, marks]);

  return (
    <div
      ref={mapRef}
      className="map"
      style={{
        height,
        width: '100%',
      }}
    ></div>
  );
};

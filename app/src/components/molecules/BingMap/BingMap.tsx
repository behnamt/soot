import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAsync } from 'react-async';
import styled from 'styled-components';
import { IBingMap, IMark } from '../../../@types/IMap';
import { loadBingApi, Microsoft } from '../../../lib/services/BingApi';

interface IMapProps {
  mapOptions?: { center: number[] };
  marks: IMark[] | undefined;
  height?: string;
}

const StyledDiv = styled.div`
  height: ${({ height }): string => height};
  width: 100%;
`;

export const BingMap: React.FC<IMapProps> = (props: IMapProps) => {
  const { mapOptions, marks, height = '80vh' } = props;

  const mapRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<IBingMap | null>(null);

  const initMap = (): IBingMap => {
    const map = new Microsoft.Maps.Map(mapRef.current);
    if (mapOptions) {
      map.setOptions(mapOptions);
    }

    return map;
  };

  useAsync({
    promiseFn: useCallback(async () => loadBingApi(), []),
    onResolve: () => setMap(initMap()),
  });

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
        map.entities.push(pin);
      });
    }
  }, [map, marks]);

  return <StyledDiv ref={mapRef} className="map" height={height}></StyledDiv>;
};

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAsync } from 'react-async';
import styled from 'styled-components';
import { IBingMap, IMark } from '@interfaces/IMap';
import { loadBingApi, Microsoft } from '@lib/BingApi';
import { ILocation } from '@soot/core/dist/@types/IPosition';

interface IMapProps {
  mapOptions?: { center: number[] };
  marks: IMark[] | undefined;
  height?: string;
  onMarksChanged?: (id: string, location: ILocation) => void;
}

const StyledDiv = styled.div`
  height: ${({ height }): string => height};
  width: 100%;
`;

export const BingMap: React.FC<IMapProps> = (props: IMapProps) => {
  const { mapOptions, marks, height = '80vh', onMarksChanged } = props;

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
        const loc = new Microsoft.Maps.Location(mark.location.latitude, mark.location.longitude);
        const pin = new Microsoft.Maps.Pushpin(loc, {
          title: mark.name,
          text: mark.id,
          draggable: mark.draggable,
        });

        //Add the pushpin to the map
        map.entities.push(pin);
        Microsoft.Maps.Events.addHandler(pin, 'dragend', () =>
          onMarksChanged(mark.id, {
            latitude: pin.changing.lastInvokedArgs.newValue.latitude,
            longitude: pin.changing.lastInvokedArgs.newValue.longitude,
          }),
        );
      });
    }
  }, [map, marks]);

  return <StyledDiv ref={mapRef} className="map" height={height}></StyledDiv>;
};

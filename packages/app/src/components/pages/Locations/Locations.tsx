import React, { useCallback, useEffect, useState } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { AsyncState, useAsync } from 'react-async';
import { IFormattedDBIncident } from '@soot/core/dist/@types/ISoot.types';
import { ILocation } from '@soot/core/dist/@types/IPosition';
import { BingMap } from '@molecules/BingMap/BingMap';
import { useSoot } from '@contexts/Soot';
import { usePosition } from '@hooks/usePosition';
import { IMark } from '@interfaces/IMap';

const VIRTUAL_EARTH_API = 'http://dev.virtualearth.net/REST/v1/Locations';

export const Locations: React.FC = () => {
  const [startPosition, setStartPosition] = useState<ILocation | null>(null);
  const [endPosition, setEndPosition] = useState<ILocation | null>(null);

  const { sootRegistryFacade } = useSoot();
  const { position, error } = usePosition();

  const { data: incidents, run: getIncidents }: AsyncState<IFormattedDBIncident[]> = useAsync({
    initialValue: [],
    deferFn: () => sootRegistryFacade?.getAllRegisterEvents(startPosition, endPosition),
    onReject: (error: Error) => console.debug(error),
  });

  useEffect((): void => {
    if (startPosition && endPosition) {
      getIncidents();
    }
  }, [startPosition, endPosition]);

  useAsync({
    promiseFn: useCallback(async () => {
      const response = await fetch(
        `${VIRTUAL_EARTH_API}/${position.latitude},${position.longitude}?key=${process.env.REACT_APP_BING_API_KEY}`,
      );
      const body = await response.json();
      const locality = body?.resourceSets?.[0].resources?.[0].address?.locality || '';

      const bboxResponse = await fetch(
        `${VIRTUAL_EARTH_API}?countryRegion=${process.env.REACT_APP_LOCATION}&locality=${locality}&key=${process.env.REACT_APP_BING_API_KEY}`,
      );
      const bboxBody = await bboxResponse.json();

      return bboxBody?.resourceSets?.[0].resources?.[0]?.bbox;
    }, [position]),
    onResolve: (bbox) => {
      setStartPosition({ latitude: bbox[0], longitude: bbox[1] });
      setEndPosition({ latitude: bbox[2], longitude: bbox[3] });
    },
    watch: position,
  });

  return (
    <>
      {!!error && (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Please enable location sharing to see incidents around you
        </Alert>
      )}
      {!error && (
        <BingMap
          mapOptions={{
            center: [position?.latitude, position?.longitude],
          }}
          marks={incidents?.map(
            (item): IMark => ({
              id: item.id,
              name: item.name,
              location: { latitude: item.latitude, longitude: item.longitude },
            }),
          )}
        />
      )}
    </>
  );
};

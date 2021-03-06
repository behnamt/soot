import React from 'react';
import { Async } from 'react-async';
import { useParams } from 'react-router-dom';
import { Box, FilledInput } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSoot } from '@contexts/Soot';
import { IFormattedDBIncident } from '@soot/core/dist/@types/ISoot.types';
import { BingMap } from '../../BingMap';

export const IncidentDetail: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();

  const { sootRegistryFacade } = useSoot();

  return (
    <Async
      promiseFn={(): Promise<IFormattedDBIncident> => sootRegistryFacade.getIncident(Number(incidentId))}
      onReject={(error: Error): void => console.debug(error)}
    >
      <Async.Pending>
        <Skeleton />
      </Async.Pending>
      <Async.Fulfilled>
        {(incident: IFormattedDBIncident): React.ReactNode => (
          <Box display="flex" flexDirection="column" p={2}>
            <FilledInput value={incident.author} />
            <FilledInput value={incident.name} />
            <FilledInput value={incident.date} />
            <FilledInput value={incident.description} />
            <BingMap
              mapOptions={{
                center: [incident.latitude, incident.longitude],
              }}
              marks={[
                {
                  id: '1',
                  name: incident.name,
                  location: { latitude: incident.latitude, longitude: incident.longitude },
                },
              ]}
              height="50vh"
            />
          </Box>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{`could not fetch the incident`}</Async.Rejected>
    </Async>
  );
};

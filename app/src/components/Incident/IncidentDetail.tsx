import React, { useEffect, useState } from 'react';
import { FilledInput, Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { IFullIncident } from '../../@types/ISoot.types';
import { useWeb3 } from '../../context/Web3';
import { loadDescription } from '../../lib/scripts/loadDescription';
import { useParams } from 'react-router-dom';
import { useSoot } from '../../context/Soot';
import { BingMap } from '../Map/BingMap';

export const IncidentDetail: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const [incident, setIncident] = useState<IFullIncident>(null);
  const [description, setDescription] = useState('');

  const { account } = useWeb3();
  const { sootRegistryFacade } = useSoot();

  useEffect(() => {
    if (sootRegistryFacade) {
      (async (): Promise<void> => {
        setIncident(await sootRegistryFacade.getIncident(Number(incidentId)));
      })();
    }
  }, [sootRegistryFacade]);

  useEffect(() => {
    if (account && incident) {
      (async (): Promise<void> => {
        setDescription(await loadDescription(account, incident.cid, incident.isEncrypted));
      })();
    }
  }, [account, incident]);

  return incident ? (
    <Box display="flex" flexDirection="column" p={2}>
      <FilledInput value={incident.author} />
      <FilledInput value={incident.name} />
      <FilledInput value={incident.date} />
      {description ? <FilledInput value={description} /> : <Skeleton />}
      <BingMap
        mapOptions={{
          center: [incident.lat, incident.lon],
        }}
        marks={[{ id: '1', name: incident.name, location: { lat: incident.lat, lng: incident.lon } }]}
        height="50vh"
      />
    </Box>
  ) : (
    <Box>
      <Skeleton />
    </Box>
  );
};

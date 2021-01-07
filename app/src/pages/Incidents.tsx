import React, { useState, useEffect, ReactElement } from 'react';
import { useSoot } from '../context/Soot';
import { useWeb3 } from '../context/Web3';
import { List } from '@material-ui/core';
import { IncidentListItem } from '../components/Incident/IncidentListItem';

export const Incidents: React.FC = () => {
  const [list, setList] = useState([]);

  const { sootRegistryFacade } = useSoot();
  const { account } = useWeb3();

  useEffect((): void => {
    (async (): Promise<void> => {
      if (sootRegistryFacade) {
        setList(await sootRegistryFacade.getAllIncidentIdsForVictim(account.address));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sootRegistryFacade]);

  return (
    <List>
      {list.map(
        (id: number): ReactElement => (
          <IncidentListItem key={id} id={id} />
        ),
      )}
    </List>
  );
};

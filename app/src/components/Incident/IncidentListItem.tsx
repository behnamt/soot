import React, { useState, useEffect } from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import { IFullIncident } from '../../@types/ISoot.types';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSoot } from '../../context/Soot';
import { useHistory } from 'react-router-dom';

export const IncidentListItem: React.FC<{ id: number }> = (props: { id: number }) => {
  const { id } = props;

  const [incident, setIncident] = useState<IFullIncident | null>(null);

  const { sootRegistryFacade } = useSoot();
  const history = useHistory();

  useEffect(() => {
    if (sootRegistryFacade) {
      (async () => {
        setIncident(await sootRegistryFacade.getIncident(id));
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sootRegistryFacade]);

  return incident ? (
    <ListItem>
      <ListItemText primary={incident.name} secondary={incident.date} onClick={() => history.push(`incidents/${id}`)} />
    </ListItem>
  ) : (
    <React.Fragment>
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />
    </React.Fragment>
  );
};

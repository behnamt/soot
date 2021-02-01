import React from 'react';
import { useHistory } from 'react-router-dom';
import { ListItem, ListItemText } from '@material-ui/core';
import { Async } from 'react-async';
import { IFormattedDBIncident } from '@soot/core/dist/@types/ISoot.types';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSoot } from '@contexts/Soot';

export const IncidentListItem: React.FC<{ id: number }> = (props: { id: number }) => {
  const { id } = props;

  const { sootRegistryFacade } = useSoot();
  const history = useHistory();

  return (
    <Async
      promiseFn={(): Promise<IFormattedDBIncident> => sootRegistryFacade.getIncident(id)}
      onReject={(error: Error): void => console.debug(error)}
    >
      <Async.Pending>
        <React.Fragment>
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </React.Fragment>{' '}
      </Async.Pending>
      <Async.Fulfilled>
        {(incident: IFormattedDBIncident): React.ReactNode => (
          <ListItem>
            <ListItemText
              primary={incident.name}
              secondary={incident.date}
              onClick={(): void => history.push(`incidents/${id}`)}
            />
          </ListItem>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{`could not fetch the incident`}</Async.Rejected>
    </Async>
  );
};

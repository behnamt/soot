import React, { ReactElement } from 'react';
import { Async } from 'react-async';
import { useHistory } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IFormattedDBIncident } from '@soot/core/dist/@types/ISoot.types';
import { useSoot } from '@contexts/Soot';

export const Incidents: React.FC = () => {
  const { sootRegistryFacade } = useSoot();
  const history = useHistory();

  return (
    <Async
      promiseFn={(): Promise<string[]> => sootRegistryFacade.getAllIncidentIdsForVictim()}
      onReject={(error: Error): void => console.debug(error)}
    >
      <Async.Pending>
        <Skeleton animation="wave" />
      </Async.Pending>
      <Async.Fulfilled>
        {(list: string[]): React.ReactNode => (
          <List>
            {list.map(
              (id: string): ReactElement => (
                <Async
                  key={id}
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
              ),
            )}
          </List>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{`could not fetch the incidents`}</Async.Rejected>
    </Async>
  );
};

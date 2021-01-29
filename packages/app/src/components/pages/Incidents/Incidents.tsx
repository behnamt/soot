import React, { ReactElement } from 'react';
import { useSoot } from '@contexts/Soot';
import { List } from '@material-ui/core';
import { IncidentListItem } from '@organisms/IncidentListItem/IncidentListItem';
import { Async } from 'react-async';
import { Skeleton } from '@material-ui/lab';

export const Incidents: React.FC = () => {
  const { sootRegistryFacade } = useSoot();

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
                <IncidentListItem key={id} id={Number(id)} />
              ),
            )}
          </List>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{`could not fetch the incidents`}</Async.Rejected>
    </Async>
  );
};

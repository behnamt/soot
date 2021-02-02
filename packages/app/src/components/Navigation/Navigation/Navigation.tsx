import React from 'react';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BottomBar } from '../BottomBar/BottomBar';
import { MenuBar } from '../MenuBar/MenuBar';
import { Incidents } from '@pages/Incidents/Incidents';
import { Locations } from '@pages/Locations/Locations';
import { Messenger } from '@pages/Messenger/Messenger';
import { Chat } from '@pages/Chat/Chat';
import { Report } from '@pages/Report/Report';
import { IncidentDetail } from '@pages/IncidentDetail/IncidentDetail';

const StyledBox = styled(Box)`
  height: 80vh;
`;

export const Navigation: React.FC = () => {
  return (
    <BrowserRouter>
      <MenuBar />
      <StyledBox>
        <Switch>
          <Route exact path="/">
            <Report />
          </Route>
          <Route exact path="/soot">
            <Report />
          </Route>
          <Route exact path="/locations">
            <Locations />
          </Route>
          <Route exact path="/messenger">
            <Messenger />
          </Route>
          <Route exact path="/incidents">
            <Incidents />
          </Route>
          <Route exact path="/chat/:name">
            <Chat />
          </Route>
          <Route path="/incidents/:incidentId">
            <IncidentDetail />
          </Route>
        </Switch>
      </StyledBox>
      <BottomBar />
    </BrowserRouter>
  );
};

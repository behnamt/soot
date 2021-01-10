import React from 'react';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BottomBar } from '../../molecules/BottomBar/BottomBar';
import { MenuBar } from '../../molecules/MenuBar/MenuBar';
import { Incidents } from '../../pages/Incidents';
import { Locations } from '../../pages/Locations';
import { Messenger } from '../../pages/Messenger';
import { MessengerChat } from '../../pages/MessengerChat';
import { Report } from '../../pages/Report';
import { IncidentDetail } from '../IncidentDetail/IncidentDetail';

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
            <MessengerChat />
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

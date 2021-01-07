import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Report } from '../../pages/Report';
import { Locations } from '../../pages/Locations';
import { Box } from '@material-ui/core';
import { BottomBar } from './BottomBar';
import { Incidents } from '../../pages/Incidents';
import { IncidentDetail } from '../Incident/IncidentDetail';
import { Messenger } from '../../pages/Messenger';
import { MessengerChat } from '../../pages/MessengerChat';
import { MenuBar } from './MenuBar';

export const Navigation: React.FC = () => {
  return (
    <BrowserRouter>
      <MenuBar />
      <Box style={{ height: '80vh' }}>
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
      </Box>
      <BottomBar />
    </BrowserRouter>
  );
};

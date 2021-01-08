import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton, Typography } from '@material-ui/core';
import { List, FlagOutlined, Map, MessageTwoTone } from '@material-ui/icons';
import { useEvents } from '../../context/Event';

export const BottomBar: React.FC = () => {
  const [hasNotificationProposals, setHasNotificationProposals] = useState(false);

  const { proposedNotifications } = useEvents();

  useEffect(() => {
    if (proposedNotifications) {
      setHasNotificationProposals(Object.keys(proposedNotifications).length > 0);
    }
  }, [proposedNotifications]);

  return (
    <Box display="flex" justifyContent="space-between" px={4}>
      <Link to="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
        <IconButton>
          <FlagOutlined />
        </IconButton>
        <Typography variant="caption">Report</Typography>
      </Link>
      <Link to="/locations" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
        <IconButton>
          <Map />
        </IconButton>
        <Typography variant="caption">Incidents near me</Typography>
      </Link>
      <Link to="/incidents" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
        <IconButton>
          <List />
        </IconButton>
        <Typography variant="caption">My reports</Typography>
      </Link>
      {hasNotificationProposals ? (
        <Link to="/messenger" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
          <IconButton>
            <MessageTwoTone />
          </IconButton>
          <Typography variant="caption">Messenger</Typography>
        </Link>
      ) : null}
    </Box>
  );
};

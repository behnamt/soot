import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { List, FlagOutlined, Map, MessageTwoTone } from '@material-ui/icons';
import { useEvents } from '../../context/Event';
import { NavigationIcon } from '../atoms/NavigationIcon';

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
      <NavigationIcon icon={<FlagOutlined />} link="/" label="Report" />
      <NavigationIcon icon={<Map />} link="/locations" label="Incidents near me" />
      <NavigationIcon icon={<List />} link="/incidents" label="My reports" />

      {hasNotificationProposals ? (
        <NavigationIcon icon={<MessageTwoTone />} link="/messenger" label="Messenger" />
      ) : null}
    </Box>
  );
};

import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/Event';
import { List } from '@material-ui/core';
import { MessengerListItem } from '../components/Messenger/MessengerListItem';

export const Messenger: React.FC = () => {
  const { proposedNotifications } = useEvents();
  const [newProposedNotifications, setNewProposedNotifications] = useState([]);

  useEffect((): void => {
    setNewProposedNotifications(
      Object.keys(proposedNotifications).map((key, index) => ({
        id: index,
        title: key,
        participants: proposedNotifications[key],
      })),
    );
  }, [proposedNotifications]);

  return newProposedNotifications.length ? (
    <List>
      {newProposedNotifications.map((item) => (
        <MessengerListItem key={item.id} title={item.title} participants={item.participants} />
      ))}
    </List>
  ) : null;
};

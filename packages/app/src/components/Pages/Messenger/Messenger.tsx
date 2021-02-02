import React, { useState, useEffect } from 'react';
import { useEvents } from '@contexts/Event';
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import styled from 'styled-components';
import makeBlockie from 'ethereum-blockies-base64';
import { useHistory } from 'react-router-dom';

const StyledImg = styled.img`
  margin-left: 5px;
  width: 30px;
  border-radius: 4px;
`;

export const Messenger: React.FC = () => {
  const { proposedNotifications } = useEvents();
  const [newProposedNotifications, setNewProposedNotifications] = useState([]);
  const history = useHistory();

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
        <ListItem key={item.id}>
          <ListItemText
            primary={`Topic: ${item.title}`}
            secondary={
              <Box component="span" display="flex" alignContent="center">
                Start chatting with
                {item.participants.map((participant: string) => (
                  <StyledImg key={participant} src={makeBlockie(participant)} title={participant} alt={participant} />
                ))}
              </Box>
            }
            onClick={(): void => history.push(`chat/${item.title}`, item.participants)}
          />
        </ListItem>
      ))}
    </List>
  ) : null;
};

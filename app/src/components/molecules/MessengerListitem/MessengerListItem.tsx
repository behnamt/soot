import { Box, ListItem, ListItemText } from '@material-ui/core';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface IMessengerListItemProps {
  title: string;
  participants: string[];
}

export const MessengerListItem: React.FC<IMessengerListItemProps> = (props: IMessengerListItemProps) => {
  const { title, participants } = props;

  const history = useHistory();

  return (
    <ListItem>
      <ListItemText
        primary={`Topic: ${title}`}
        secondary={
          <Box component="span" display="flex" alignContent="center">
            Start chatting with
            {participants.map((item: string) => (
              <img
                key={item}
                src={makeBlockie(item)}
                title={item}
                alt={item}
                style={{ marginLeft: '5px', width: '30px', borderRadius: '4px' }}
              />
            ))}
          </Box>
        }
        onClick={(): void => history.push(`chat/${title}`, participants)}
      />
    </ListItem>
  );
};

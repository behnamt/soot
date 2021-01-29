import React from 'react';
import { Box, ListItem, ListItemText } from '@material-ui/core';
import makeBlockie from 'ethereum-blockies-base64';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
interface IMessengerListItemProps {
  title: string;
  participants: string[];
}

const StyledImg = styled.img`
  margin-left: 5px;
  width: 30px;
  border-radius: 4px;
`;

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
              <StyledImg key={item} src={makeBlockie(item)} title={item} alt={item} />
            ))}
          </Box>
        }
        onClick={(): void => history.push(`chat/${title}`, participants)}
      />
    </ListItem>
  );
};

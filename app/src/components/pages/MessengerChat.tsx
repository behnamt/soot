import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAsync } from 'react-async';
import { Send } from '@material-ui/icons';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import makeBlockie from 'ethereum-blockies-base64';
import { useWeb3 } from '../../context/Web3';
import { subscribe, publish, unsubscribe } from '../../lib/services/IpfsService';
import chatStorage from '../../lib/services/storage/ChatStorage';
import { IChatItem } from '../../@types/IChat.types';

export const MessengerChat: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const location: { state: string[] } = useLocation();
  const { account } = useWeb3();

  const [participants, setParticipants] = useState([]);
  const [messageList, setMessageList] = useState<IChatItem[]>([]);
  const [currentText, setCurrentText] = useState('');

  const subscription = (data): void => {
    const item = {
      id: data.seqno,
      text: data.content,
      avatar: makeBlockie(data.from),
      address: data.from,
    };
    chatStorage.addChat(item);
    setMessageList([...messageList, item]);
  };

  const sendMessage = (e): void => {
    e.preventDefault();
    publish(name, currentText, account.address);
    setCurrentText('');
  };

  useEffect(() => {
    if (account) {
      if (!location.state || !Array.isArray(location.state)) {
        console.debug('wrong state parameter');
      }
      setParticipants([...location.state, account.address]);
    }
  }, [location.state, account]);

  useEffect(() => {
    if (participants.length) {
      subscribe(name, account.address, subscription);
    }

    return (): void => {
      unsubscribe(name);
    };
  }, [participants, messageList]);

  useAsync({
    promiseFn: useCallback(chatStorage.getAllChats, []),
    onResolve: (initialChats) => setMessageList(initialChats),
  });

  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-end" height="100%">
      <Box display="flex" flexDirection="row" width="1" flex="1">
        Topic: {name}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        width="1"
        flex="10"
        alignItems="start"
        style={{ overflowY: 'auto', maxHeight: '70vh' }}
      >
        {messageList.map((message) => (
          <Box
            key={message.id}
            py={0.5}
            display="flex"
            alignItems="center"
            flexDirection={message.address === account.address ? 'row' : 'row-reverse'}
            alignSelf={message.address === account.address ? 'flex-start' : 'flex-end'}
          >
            <img
              src={message.avatar}
              alt={message.address}
              style={{ width: '40px', borderRadius: '9px', marginRight: '5px', marginLeft: '5px' }}
            />
            <Typography>{message.text}</Typography>
          </Box>
        ))}
      </Box>
      <form onSubmit={sendMessage}>
        <Box display="flex" flexDirection="row" width="1" flex="1">
          <TextField
            id="current-text"
            variant="outlined"
            style={{ flex: 1 }}
            value={currentText}
            onChange={(e): void => setCurrentText(e.target.value)}
          />
          <IconButton aria-label="send" size="small" onClick={sendMessage}>
            <Send fontSize="inherit" />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

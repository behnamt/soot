import React, { useState, useEffect } from 'react';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import { useLocation, useParams } from 'react-router-dom';
import { useWeb3 } from '../context/Web3';
import { subscribe, publish, unsubscribe } from '../lib/services/IpfsService';
import { Send } from '@material-ui/icons';
import makeBlockie from 'ethereum-blockies-base64';
import chatStorage from '../lib/services/storage/ChatStorage';
import { IChatItem } from '../@types/IChat.types';

export const MessengerChat: React.FC = () => {
    const { name } = useParams();
    const location: { state: string[] } = useLocation();
    const { account } = useWeb3();

    const [participants, setParticipants] = useState([]);
    const [messageList, setMessageList] = useState<IChatItem[]>([]);
    const [currentText, setCurrentText] = useState('');

    const subscription = (data) => {
        const item = {
            id: data.seqno,
            text: data.content,
            avatar: makeBlockie(data.from),
            address: data.from,
        };
        chatStorage.addChat(item);
        setMessageList([...messageList, item]);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        publish(name, currentText, account.address);
        setCurrentText('');
    }

    useEffect(() => {
        if (account) {
            if (!location.state || !Array.isArray(location.state)) {
                console.error('wrong state parameter');
            }
            setParticipants([...location.state, account.address]);
        }
    }, [location.state, account]);

    useEffect(() => {
        if (participants.length) {
            subscribe(name, account.address, subscription);
        }
        return () => {
            console.log('UNSSSS');
            unsubscribe(name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participants, messageList])

    useEffect(() => {
        (async () => {
            const initialChats = await chatStorage.getAllChats();
            setMessageList(initialChats);
        })();
    }, [])

    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-end" height="100%" >
            <Box display="flex" flexDirection="row" width="1" flex="1">
                Topic: {name}
            </Box>

            <Box display="flex" flexDirection="column" width="1" flex="10" alignItems="start" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                {messageList.map(message => (
                    <Box
                        key={message.id}
                        py={0.5}
                        display="flex"
                        alignItems="center"
                        flexDirection={message.address === account.address ? 'row' : 'row-reverse'}
                        alignSelf={message.address === account.address ? 'flex-start' : 'flex-end'}>
                        <img
                            src={message.avatar}
                            alt={message.address}
                            style={{ width: '40px', borderRadius: '9px', marginRight: '5px', marginLeft: '5px' }} />
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
                        onChange={(e) => setCurrentText(e.target.value)} />
                    <IconButton
                        aria-label="send"
                        size="small"
                        onClick={sendMessage}>
                        <Send fontSize="inherit" />
                    </IconButton>
                </Box>
            </form>

        </Box>

    );
};

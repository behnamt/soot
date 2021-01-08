import { Box, Button, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useWeb3 } from '../../context/Web3';
import KeyValueWalletService from '../../lib/services/KeyValueWalletService';
import storage from '../../lib/services/storage/AppStorage.service';
import { CreateWallet } from './CreateWallet';
import { UnlockWallet } from './UnlockWallet';
import { LoginHeader } from './LoginHeader';
import { useAsync } from 'react-async';

const getWallet = async (web3Instance): Promise<KeyValueWalletService> => {
  try {
    const wallet = new KeyValueWalletService(web3Instance, storage);
    await wallet.ensureExists();

    return wallet;
  } catch (e) {
    throw e;
  }
};

export const Login: React.FC = () => {
  const [localWallet, setLocalWallet] = useState<KeyValueWalletService>();
  const { web3Instance, isMetaMask, connect } = useWeb3();

  useAsync({
    promiseFn: useCallback(() => getWallet(web3Instance), []),
    onResolve: setLocalWallet,
    onReject: (error: Error) => console.debug(error),
  });

  const connectToWallet = (): void => {
    connect();
  };

  return (
    <Box display="flex" flexDirection="column">
      <LoginHeader />
      {isMetaMask ? (
        <Box p={3} display="flex" justifyContent="center" flexDirection="column">
          <Typography variant="subtitle1">Seems like you have a built in wallet</Typography>
          <Button variant="contained" color="primary" title="Import" onClick={connectToWallet}>
            Connect with Wallet
          </Button>
        </Box>
      ) : localWallet ? (
        <UnlockWallet />
      ) : (
        <CreateWallet />
      )}
    </Box>
  );
};

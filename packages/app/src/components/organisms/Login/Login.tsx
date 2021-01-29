import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-async';
import { Box, Button, Typography } from '@material-ui/core';
import { useWeb3 } from '@contexts/Web3';
import KeyValueWalletService from '@soot/core/dist/services/KeyValueWalletService';
import storage from '@soot/core/dist/services/storage/AppStorage.service';
import { LoginHeader } from '@atoms/LoginHeader/LoginHeader';
import { CreateWallet } from '../CreateWallet/CreateWallet';
import { UnlockWallet } from '@molecules/UnlockWallet/UnlockWallet';

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

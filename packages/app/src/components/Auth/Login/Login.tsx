import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-async';
import { Box, Typography } from '@material-ui/core';
import { useWeb3 } from '@contexts/Web3';
import KeyValueWalletService from '@soot/core/dist/services/KeyValueWalletService';
import storage from '@soot/core/dist/services/storage/AppStorage.service';
import { LoginHeader } from '../LoginHeader/LoginHeader';
import { CreateWallet } from '../CreateWallet/CreateWallet';
import { UnlockWallet } from '../UnlockWallet/UnlockWallet';
import { LoadingButton } from '../../LoadingButton';

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
  const { web3Instance, isBrowserWallet, connect, isPending } = useWeb3();

  useAsync({
    promiseFn: useCallback(() => getWallet(web3Instance), []),
    onResolve: setLocalWallet,
  });

  const connectToWallet = (): void => {
    connect();
  };

  return (
    <Box display="flex" flexDirection="column">
      <LoginHeader />
      {isBrowserWallet ? (
        <Box display="flex">
          <Typography variant="subtitle1">Seems like you have a built in wallet</Typography>
          <Box>
            <LoadingButton
              disabled={isPending}
              loading={isPending}
              variant="contained"
              color="primary"
              title="Import"
              onClick={connectToWallet}
            >
              Connect with Wallet
            </LoadingButton>
          </Box>
        </Box>
      ) : localWallet ? (
        <UnlockWallet />
      ) : (
        <CreateWallet />
      )}
    </Box>
  );
};

import React, { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { useWeb3 } from '@contexts/Web3';
import createWallet from '@scripts/createWallet';
import createWalletFromPrivateKey from '@scripts/createWalletFromPrivateKey';
import KeyValueWalletService from '@services/KeyValueWalletService';
import storage from '@services/storage/AppStorage.service';
import { CreateWalletForm } from '@molecules/CreateWalletForm/CreateWalletForm';
import { ImportWalletForm } from '@molecules/ImportWalletForm/ImportWalletForm';

export const CreateWallet: React.FC = () => {
  const [password, setPassword] = useState('');
  const [privatekey, setPrivateKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmittable, setIsSubmittable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(true);

  const { web3Instance, connect } = useWeb3();

  const submit = async (): Promise<void> => {
    if (isSubmittable) {
      setIsLoading(true);
      try {
        const wallet = new KeyValueWalletService(web3Instance, storage);
        let account;
        if (isCreatingWallet) {
          [account] = createWallet(password, 1, wallet);
        } else {
          account = createWalletFromPrivateKey(password, privatekey, wallet);
        }

        console.debug('saved wallet with public address: %s', account.address);

        setIsLoading(false);
        // goes after loading because its effect will destroy us
        await connect(account);
      } catch (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    }
  };

  const toggle = (): void => {
    setIsCreatingWallet(!isCreatingWallet);
    setIsSubmittable(false);
  };

  const createWalletFormSubmittableChanged = (password: string): void => {
    if (!password) {
      setIsSubmittable(false);
      setPassword('');
    } else {
      setIsSubmittable(true);
      setPassword(password);
    }
  };

  const importWalletFormSubmittableChanged = (password: string, privateKey: string): void => {
    if (!password) {
      setIsSubmittable(false);
      setPassword('');
      setPrivateKey('');
    } else {
      setIsSubmittable(true);
      setPassword(password);
      setPrivateKey(privateKey);
    }
  };

  return (
    <form onSubmit={submit}>
      <Box p={3} display="flex" justifyContent="center" flexDirection="column">
        {isCreatingWallet ? (
          <CreateWalletForm onSubmittableChanged={createWalletFormSubmittableChanged} />
        ) : (
          <ImportWalletForm onSubmittableChanged={importWalletFormSubmittableChanged} />
        )}
        <Typography variant="caption" align="center">
          {errorMessage}
        </Typography>
        <Box mb={2} display="flex" justifyContent="center" width={1}>
          <Button variant="contained" color="primary" disabled={!password || isLoading} title="Login" onClick={submit}>
            {isCreatingWallet ? 'Create Wallet' : 'Import Wallet'}
          </Button>
        </Box>
        <Box mb={2} display="flex" justifyContent="center" width={1}>
          <Button variant="outlined" color="primary" title="Import" onClick={toggle}>
            {isCreatingWallet ? 'Or Import wallet' : 'Or Create a wallet'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

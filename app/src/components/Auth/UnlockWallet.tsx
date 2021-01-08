import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3';
import KeyValueWalletService from '../../lib/services/KeyValueWalletService';
import storage from '../../lib/services/storage/AppStorage.service';
import { Box, TextField, Button } from '@material-ui/core';

export const UnlockWallet: React.FC = () => {
  const [password, setPassword] = useState('');
  const { connect, web3Instance } = useWeb3();

  const submit = async (): Promise<void> => {
    const walletService = new KeyValueWalletService(web3Instance, storage);
    const account = await walletService.loadAccount(password, 0);
    connect(account);
  };

  return (
    <form onSubmit={submit}>
      <Box p={3} display="flex" justifyContent="center" flexDirection="column">
        <Box mb={2} display="flex" justifyContent="center" width={1}>
          <TextField
            type="password"
            variant="outlined"
            onChange={(event): void => setPassword(event.target.value)}
            value={password}
          />
        </Box>
        <Box mb={2} display="flex" justifyContent="center" width={1}>
          <Button disabled={!password} title="Login" color="primary" onClick={submit}>
            Login
          </Button>
        </Box>
      </Box>
    </form>
  );
};

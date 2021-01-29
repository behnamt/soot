import React from 'react';
import { useWeb3 } from '@contexts/Web3';
import { useIpfs } from '@contexts/IPFS';
import { Box, CircularProgress, Typography } from '@material-ui/core';

export const ContextAwareApp: React.FC = ({ children }: { children: React.ReactNode }) => {
  const { web3Instance } = useWeb3();
  const { isPending, ipfs } = useIpfs();

  return !!web3Instance && !isPending && !!ipfs ? (
    <>{children}</>
  ) : (
    <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
      <CircularProgress color="secondary" />
      <Typography variant="body2">Loading assets...</Typography>
    </Box>
  );
};

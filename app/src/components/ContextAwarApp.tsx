import React from 'react';
import { Alert } from '@material-ui/lab';
import { useWeb3 } from '@contexts/Web3';
import { useIpfs } from '@contexts/IPFS';

export const ContextAwareApp: React.FC = ({ children }: { children: React.ReactNode }) => {
  const { web3Instance } = useWeb3();
  const { isPending, ipfs } = useIpfs();

  return !!web3Instance && !isPending && !!ipfs ? (
    <>{children}</>
  ) : (
    <>
      <Alert icon={false} severity="info">
        Loading...
      </Alert>
    </>
  );
};

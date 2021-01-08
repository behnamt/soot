import React, { PropsWithChildren, useContext } from 'react';
import { useAsync, AsyncState } from 'react-async';
import IPFS from 'ipfs';
import { IpfsContextInterface } from '../@types/IpfsContextInterface';
import { startNode } from '../lib/services/IpfsService';

const ipfsContext = React.createContext<IpfsContextInterface>({
  ipfs: null,
  isPending: false,
});

const useIpfs = () => useContext(ipfsContext);

const useIpfsProvider = () => {
  const { data: ipfs, isPending }:AsyncState<IPFS> = useAsync(
    {
      promiseFn: startNode,
      onReject: (error: Error) => console.error(error),
    },
  );

  return { ipfs, isPending };
};

const IpfsProvider = ({ children }: PropsWithChildren<any>) => {
  const ipfs = useIpfsProvider();

  return <ipfsContext.Provider value={ipfs}>{children}</ipfsContext.Provider>;
};

export { IpfsProvider, useIpfs };

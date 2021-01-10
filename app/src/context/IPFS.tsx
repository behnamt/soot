import React, { useContext } from 'react';
import { useAsync, AsyncState } from 'react-async';
import IPFS from 'ipfs';
import { IpfsContextInterface } from '@interfaces/IpfsContextInterface';
import { startNode } from '@services/IpfsService';

const ipfsContext = React.createContext<IpfsContextInterface>({
  ipfs: null,
  isPending: false,
});

const useIpfs = (): IpfsContextInterface => useContext(ipfsContext);

const useIpfsProvider = (): IpfsContextInterface => {
  const { data: ipfs, isPending }: AsyncState<IPFS> = useAsync({
    promiseFn: startNode,
    onReject: (error: Error) => console.debug(error),
  });

  return { ipfs, isPending };
};

const IpfsProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const ipfs = useIpfsProvider();

  return <ipfsContext.Provider value={ipfs}>{children}</ipfsContext.Provider>;
};

export { IpfsProvider, useIpfs };

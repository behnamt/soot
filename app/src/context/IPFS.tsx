import React, { useState, PropsWithChildren, useContext } from 'react';
import { useAsync } from 'react-async';
import { IpfsContextInterface } from '../@types/IpfsContextInterface';
import { startNode } from '../lib/services/IpfsService';

const ipfsContext = React.createContext<IpfsContextInterface>({
  ipfs: null,
});

const useIpfs = () => useContext(ipfsContext);

const useIpfsProvider = () => {
  const [ipfs, setIpfs] = useState<any>(null);

  useAsync(
    {
      promiseFn: startNode,
      onReject: (error: Error) => console.error(error),
      onResolve: (ipfsNode) => setIpfs(ipfsNode),
    },
  );

  return { ipfs };
};

const IpfsProvider = ({ children }: PropsWithChildren<any>) => {
  const ipfs = useIpfsProvider();

  return <ipfsContext.Provider value={ipfs}>{children}</ipfsContext.Provider>;
};

export { IpfsProvider, useIpfs };

import React, { useState, useContext, useEffect } from 'react';
import { useWeb3 } from './Web3';
import SootFacade from '../lib/classes/SootFacade';
import SootRegistryFacade from '../lib/classes/SootFacade';

interface ISootContext {
  sootRegistryFacade: SootRegistryFacade | null;
}

const sootContext = React.createContext<ISootContext>({
  sootRegistryFacade: null,
});

const useSoot = (): ISootContext => useContext(sootContext);

const useSootProvider = (): ISootContext => {
  const [sootRegistryFacade, setSootRegistryFacade] = useState<SootRegistryFacade | null>(null);
  const { web3Instance, account } = useWeb3();

  useEffect((): void => {
    if (web3Instance && account) {
      setSootRegistryFacade(
        new SootFacade(web3Instance, account, process.env.REACT_APP_SOOT_REGISTRY_CONTRACT_ADDRESS!),
      );
    }
  }, [web3Instance, account]); // eslint-disable-line

  return {
    sootRegistryFacade,
  };
};

const SootProvider = ({ children }: any) => {
  const sootRegistryFacade = useSootProvider();

  return <sootContext.Provider value={sootRegistryFacade}>{children}</sootContext.Provider>;
};

export { SootProvider, useSoot };

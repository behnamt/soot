import React, { useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import EthCrypto from 'eth-crypto';
import { Account, HttpProvider } from 'web3-core';
import WrappedAccount from '@soot/core/dist/classes/WrappedAccount';
import { IWeb3Context } from '@interfaces/IWeb3Context';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let ethereum: any;

const web3Context = React.createContext<IWeb3Context>({
  isMetaMask: false,
  web3Instance: null,
  account: null,
  connect: () => null,
  disconnect: () => null,
  getPublicKey: () => null,
});

const useWeb3 = (): IWeb3Context => useContext(web3Context);

const useWeb3Provider = (): IWeb3Context => {
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isMetaMask, setIsMetaMask] = useState<boolean>(false);

  const handleAccountsChanged = async (accounts: (string | Account)[]): Promise<void> => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      const firstAccount = typeof accounts[0] === 'string' ? new WrappedAccount(accounts[0] as string) : accounts[0];
      setAccount(firstAccount);
      console.debug('account changed: %s', firstAccount.address);
    }
  };

  useEffect((): void => {
    if (window.ethereum) {
      const web3: Web3 = new Web3(ethereum);
      window.ethereum.enable();
      setIsMetaMask(true);
      setWeb3Instance(web3);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      const web3: Web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.REACT_APP_ETHEREUM_NODE));
      setWeb3Instance(web3);
    }
  }, []); // eslint-disable-line

  const getPublicKey = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = web3Instance.currentProvider as HttpProvider;

        provider.send(
          {
            jsonrpc: '2.0',
            method: 'eth_getEncryptionPublicKey',
            params: [account],
          },
          // eslint-disable-next-line
          (err: Error, result: any) => {
            if (err || !result) {
              return reject(err);
            }
            if (result.error) {
              return reject(result.error);
            }

            return resolve(result.result);
          },
        );
      } else {
        if (!account.privateKey) {
          return reject(new Error('no private key provided'));
        }

        return resolve(EthCrypto.publicKeyByPrivateKey(account.privateKey));
      }
    });
  };

  const connect = async (_account: Account | string): Promise<void> => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const account = await window.ethereum.selectedAddress;
          handleAccountsChanged([account]);
        } catch (error) {
          console.debug(error);
        }
      } else {
        await handleAccountsChanged([_account]);
      }
    } catch (err) {
      if (err.code === 4001) {
        throw new Error('Please connect to MetaMask.');
      } else {
        throw new Error(err);
      }
    }
  };

  const disconnect = async (): Promise<void> => {
    setAccount(null);
  };

  return {
    isMetaMask,
    web3Instance,
    account,
    connect,
    disconnect,
    getPublicKey,
  };
};

const Web3Provider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const web3 = useWeb3Provider();

  return <web3Context.Provider value={web3}>{children}</web3Context.Provider>;
};

export { Web3Provider, useWeb3 };

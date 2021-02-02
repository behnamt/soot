import React, { useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import EthCrypto from 'eth-crypto';
import { Account } from 'web3-core';
import WrappedAccount from '@soot/core/dist/classes/WrappedAccount';
import { IWeb3Context } from '@interfaces/IWeb3Context';
import { useToast } from './Toast';
import { EToastTypes } from '@interfaces/IToast.types';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let ethereum: any;

const web3Context = React.createContext<IWeb3Context>({
  isBrowserWallet: false,
  isPending: false,
  web3Instance: null,
  account: null,
  connect: () => null,
  disconnect: () => null,
  encryptionPublicKey: null,
});

const useWeb3 = (): IWeb3Context => useContext(web3Context);

const useWeb3Provider = (): IWeb3Context => {
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isBrowserWallet, setIsBrowserWallet] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [encryptionPublicKey, setEncryptionPublicKey] = useState<string>('');

  const { add } = useToast();

  const handleAccountsChanged = async (accounts: (string | Account)[]): Promise<void> => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      const firstAccount = typeof accounts[0] === 'string' ? new WrappedAccount(accounts[0] as string) : accounts[0];

      setAccount(firstAccount);
      console.debug('account changed: %s', firstAccount.address);
    }
  };

  const setBrowserWalletPublicKey = async (address: string): Promise<void> => {
    if (!web3Instance) {
      console.error('where is web3 instance?');
    }
    add('Please provide the public key so you can encrypt your data with your key');
    try {
      const key = await window.ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [address], // you must have access to the specified account
      });
      setEncryptionPublicKey(key);
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        add('public ket rejected! non of the data will be encrypted', true, EToastTypes.WARNING);
      } else {
        console.error(error);
      }
    }
  };

  const setLocalWalletPublicKey = (account: Account): void => {
    if (!account.privateKey) {
      console.error('no private key provided');
    }

    setEncryptionPublicKey(EthCrypto.publicKeyByPrivateKey(account.privateKey));
  };

  const getBrowserWalletAccount = async (): Promise<string[]> => {
    return window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const connect = async (_account: Account | string): Promise<void> => {
    if (isBrowserWallet) {
      try {
        setIsPending(true);
        const account = await getBrowserWalletAccount();
        setBrowserWalletPublicKey(account[0]);
        handleAccountsChanged(account);
        setIsPending(false);
      } catch (error) {
        console.debug(error);
      }
    } else {
      await handleAccountsChanged([_account]);
      setLocalWalletPublicKey(_account as Account);
    }
  };

  const disconnect = async (): Promise<void> => {
    setAccount(null);
  };

  useEffect((): void => {
    if (window.ethereum) {
      const web3: Web3 = new Web3(ethereum);
      window.ethereum.enable();
      setIsBrowserWallet(true);
      setWeb3Instance(web3);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      const web3: Web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.REACT_APP_ETHEREUM_NODE));
      setWeb3Instance(web3);
    }
  }, []);

  return {
    isBrowserWallet,
    isPending,
    web3Instance,
    account,
    connect,
    disconnect,
    encryptionPublicKey,
  };
};

const Web3Provider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const web3 = useWeb3Provider();

  return <web3Context.Provider value={web3}>{children}</web3Context.Provider>;
};

export { Web3Provider, useWeb3 };

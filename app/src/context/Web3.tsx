import React, { useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import { Account, HttpProvider } from 'web3-core';
import WrappedAccount from '../lib/classes/WrappedAccount';
import { IWeb3Context } from '../@types/IWeb3Context';
import EthCrypto from 'eth-crypto';

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
      // eslint-disable-next-line no-underscore-dangle
      const _account = typeof accounts[0] === 'string' ? new WrappedAccount(accounts[0] as string) : accounts[0];
      setAccount(_account);
      console.debug('account changed: %s', _account.address);
    }
  };

  useEffect((): void => {
    if (window.ethereum) {
      const web3: Web3 = new Web3(ethereum);
      setIsMetaMask(true);
      setWeb3Instance(web3);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {

    const web3: Web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.REACT_APP_ETHEREUM_NODE!));

    setWeb3Instance(web3);
    }
  }, []); // eslint-disable-line

  const connect = async (_account: Account | string): Promise<void> => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log('1');
        
        try {
          const accounts = await window.ethereum.enable();
          console.log({ accounts });
          
          handleAccountsChanged(accounts);
        } catch (error) {
          console.log(error);
        } 
      } else {
        await handleAccountsChanged([_account]);
      }
      // ethereum.send('eth_requestAccounts');
      // web3Instance.eth.personal.getAccounts();
      // web3.eth.requestAccounts([callback])
      // https://web3js.readthedocs.io/en/v1.2.6/web3-eth.html#requestaccounts
      // const accounts = await web3Instance.eth.personal.getAccounts();
      // Todo: Shouldn't we use web3Instance.eth.givenProvider.selectedAddress?
      // const tempAccount = accounts[0];
      // setAccount(tempAccount);
    } catch (err) {
      if (err.code === 4001) {
        // EIP 1193 userRejectedRequest error
        throw new Error('Please connect to MetaMask.');
      } else {
        throw new Error(err);
      }
    }
  };

  const getPublicKey = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      if (typeof (window) !== 'undefined' && window.ethereum) {
        const provider = web3Instance.currentProvider as HttpProvider;
      
        provider.send({
          jsonrpc: '2.0',
          method: 'eth_getEncryptionPublicKey',
          params: [account],
          // from: this.account,
        }, (err: any, result: any) => {
          if (err || !result) return reject(err);
          if (result.error) return reject(result.error);
          return resolve(result.result);
        });
      } else {

      if (!account.privateKey) {
        return reject(new Error('no private key provided'));
      }

      return resolve(EthCrypto.publicKeyByPrivateKey(account.privateKey));
      }
    });
  };

  const disconnect = async (): Promise<any> => {
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

const Web3Provider = ({ children }: any) => {
  const web3 = useWeb3Provider();

  return <web3Context.Provider value={web3}>{children}</web3Context.Provider>;
};

export { Web3Provider, useWeb3 };

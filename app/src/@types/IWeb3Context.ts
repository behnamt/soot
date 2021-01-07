import Web3 from 'web3';
import { Account } from 'web3-core';

export interface IWeb3Context {
  isMetaMask: boolean;
  web3Instance: Web3 | null;
  account: Account | null;
  connect: Function;
  disconnect: Function;
  getPublicKey: () => Promise<string>;
}

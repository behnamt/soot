import { Account } from 'web3-core';
import IPersistentWallet from '../../@types/IPersistentWallet.types';
import WalletService from '../services/WalletService';

const createWallet = (
  walletPassword: string,
  numberOfAccounts = 1,
  walletService: WalletService & IPersistentWallet,
): Account[] => {
  const accounts = walletService.createAccounts(numberOfAccounts);
  const keystore = walletService.encryptWallet(walletPassword);
  walletService.writeWallet(JSON.stringify(keystore, null, 2));

  return accounts;
};

export default createWallet;

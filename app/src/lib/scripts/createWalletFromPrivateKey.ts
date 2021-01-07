import { Account } from 'web3-core';
import WalletService from '../services/WalletService';
import IPersistentWallet from '../../@types/IPersistentWallet.types';
import createWallet from './createWallet';

const privateKeyRegex = new RegExp('^0x');

const createWalletFromPrivateKey = async (
  walletPassword: string,
  privateKey: string,
  persistentWallet: WalletService & IPersistentWallet,
): Promise<Account> => {
  // eslint-disable-next-line no-underscore-dangle
  let _privateKey = privateKey;
  if (!privateKeyRegex.test(_privateKey)) {
    _privateKey = `0x${_privateKey}`;
  }

  try {
    persistentWallet.loadWallet(walletPassword);
  } catch (error) {
    createWallet(walletPassword, 0, persistentWallet);
  }

  const account = persistentWallet.addAccountByPrivateKey(_privateKey);
  const keystore = persistentWallet.encryptWallet(walletPassword);
  persistentWallet.writeWallet(JSON.stringify(keystore, null, 2));

  return account;
};

export default createWalletFromPrivateKey;

import Web3 from 'web3';
import { Account, WalletBase, EncryptedKeystoreV3Json } from 'web3-core';

export default class WalletService {
  private readonly web3: Web3;

  private encryptedKeystore: EncryptedKeystoreV3Json[]; // represents a keystore

  private wallet: WalletBase; // the "loaded" (decrypted) wallet

  constructor(web3: Web3) {
    this.web3 = web3;
    this.wallet = web3.eth.accounts.wallet;
    this.encryptedKeystore = [];
  }

  public decryptWallet(encryptedKeystore: EncryptedKeystoreV3Json[], password: string): WalletBase {
    this.encryptedKeystore = encryptedKeystore;
    this.wallet = this.web3.eth.accounts.wallet.decrypt(encryptedKeystore, password);

    return this.wallet;
  }

  public encryptWallet(password: string): EncryptedKeystoreV3Json[] {
    this.encryptedKeystore = this.web3.eth.accounts.wallet.encrypt(password);

    return this.encryptedKeystore;
  }

  public addAccountByPrivateKey(privateKey: string): Account {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);

    return this.addAccount(account);
  }

  public addAccount(account: Account): Account {
    this.wallet.add(account);

    return account;
  }

  public get size(): number {
    return this.wallet.length;
  }

  public get accounts(): Account[] {
    const ret = [];
    // a wallet is not iterable :(
    for (let i = 0; i < this.size; i++) {
      ret.push(this.wallet[i]);
    }

    return ret;
  }

  public createAccounts(numberOfAccounts = 1): Account[] {
    if (!this.wallet) {
      throw new Error('you must load a wallet before you can use it');
    }
    const walletAccounts = [];
    for (let i = 0; i < numberOfAccounts; i++) {
      const account = this.web3.eth.accounts.create();
      walletAccounts.push(account);
      this.wallet.add(account);
    }

    return walletAccounts;
  }

  public getAccount(accountIdx = 0): Account {
    if (!this.wallet) {
      throw new Error('you must load a wallet before you can use it');
    }

    if (!this.wallet[accountIdx]) {
      throw new Error(`no account at position ${accountIdx}`);
    }

    return this.wallet[accountIdx];
  }
}

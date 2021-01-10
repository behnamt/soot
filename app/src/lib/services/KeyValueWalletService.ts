import { WalletBase, Account } from 'web3-core';
import Web3 from 'web3';
import WalletService from './WalletService';
import IPersistentWallet from '@interfaces/IPersistentWallet.types';
import { IKeyValueStorage } from '@interfaces/IKeyValueStorage.types';

export default class KeyValueWalletService extends WalletService implements IPersistentWallet {
  private keyValueStore: IKeyValueStorage;

  private walletKey: string;

  constructor(web3: Web3, keyValueStore: IKeyValueStorage, walletKey = 'wallet.keystore') {
    super(web3);
    this.keyValueStore = keyValueStore;
    this.walletKey = walletKey;
  }

  public ensureExists(): void {
    if (!this.keyValueStore.getItem(this.walletKey)) {
      throw new Error("wallet doesn't exist");
    }

    if (!this.hasWalletAccount()) {
      throw new Error("wallet doesn't exist");
    }
  }

  public writeWallet(content: string): void {
    this.keyValueStore.setItem(this.walletKey, content);
  }

  public loadWallet(password: string): WalletBase {
    this.ensureExists();
    const jsonKeyStore = JSON.parse(this.keyValueStore.getItem(this.walletKey));

    return this.decryptWallet(jsonKeyStore, password);
  }

  public loadAccount(password: string, accountIndex = 0): Account {
    this.loadWallet(password);

    return this.getAccount(accountIndex);
  }

  private hasWalletAccount(): boolean {
    const jsonKeyStore = JSON.parse(this.keyValueStore.getItem(this.walletKey));

    return jsonKeyStore.length > 0;
  }
}

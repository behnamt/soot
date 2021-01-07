/* eslint-disable class-methods-use-this */
import fs from 'fs';

import { WalletBase, Account } from 'web3-core';
import Web3 from 'web3';
import WalletService from './WalletService';
import IPersistentWallet from '../../@types/IPersistentWallet.types';

export default class FileSystemWalletService extends WalletService implements IPersistentWallet {
  private fileName: string;

  constructor(web3: Web3, fileName = 'wallet.keystore') {
    super(web3);
    this.fileName = fileName;
  }

  public writeWallet(content: string): void {
    fs.writeFileSync(this.fileName, content, { encoding: 'utf-8' });
  }

  public ensureExists(): void {
    if (!fs.existsSync(this.fileName)) {
      throw new Error(`${this.fileName} doesn't exist`);
    }
  }

  public loadWallet(password: string): WalletBase {
    this.ensureExists();
    const jsonKeyStore = JSON.parse(fs.readFileSync(this.fileName).toString());

    return this.decryptWallet(jsonKeyStore, password);
  }

  public loadAccount(password: string, accountIndex = 0): Account {
    this.ensureExists();
    this.loadWallet(password);

    return this.getAccount(accountIndex);
  }
}

import { Account, WalletBase } from 'web3-core';

export default interface IPersistentWallet {
  writeWallet(content: string): void;
  loadWallet(password: string): WalletBase;
  ensureExists(): void;
  loadAccount(password: string, accountIndex: number): Account;
}

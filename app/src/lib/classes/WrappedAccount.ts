/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars, class-methods-use-this */

import { Account, TransactionConfig, SignedTransaction, Sign, EncryptedKeystoreV3Json } from 'web3-core';

export default class WrappedAccount implements Account {
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  signTransaction(
    transactionConfig: TransactionConfig,
    callback?: (signTransaction: SignedTransaction) => void,
  ): Promise<SignedTransaction> {
    throw new Error('signing not supported in Wrapped accounts');
  }

  sign(data: string): Sign {
    throw new Error('signing not supported in Wrapped accounts');
  }

  encrypt(password: string): EncryptedKeystoreV3Json {
    throw new Error('cant use encrypt in a wrapped account');
  }

  get privateKey(): string {
    throw new Error("I'm a wrapped account");
  }
}

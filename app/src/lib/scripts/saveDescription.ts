import IPFS, { CID } from 'ipfs';
import { encrypt } from '../services/EncryptionService';
import { Account } from 'web3-core';

export const saveDescription = async (
  account: Account,
  ipfs: IPFS,
  content: string,
  isEncrypted: boolean,
  getPublicKey: () => Promise<string>,
): Promise<CID> => {
  let _content = content;
  if (isEncrypted) {
    _content = await encrypt(account, content, await getPublicKey());
  }
  const entry = await ipfs.add(_content);

  return entry.cid;
};

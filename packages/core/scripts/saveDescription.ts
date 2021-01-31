import IPFS, { CID } from 'ipfs';
import { encrypt } from '@services/EncryptionService';

export const saveDescription = async (
  ipfs: IPFS,
  content: string,
  isEncrypted: boolean,
  encryptionPublicKey: string,
): Promise<CID> => {
  let _content = content;  
  if (isEncrypted && encryptionPublicKey) {
    _content = await encrypt(content, encryptionPublicKey);
  }
  const entry = await ipfs.add(_content);

  return entry.cid;
};

import { Account } from 'web3-core';
import { getContent } from '../services/IpfsService';
import { decrypt } from '../services/EncryptionService';

export const loadDescription = async (account: Account, cid: string, isEncrypted: boolean): Promise<string> => {
  let content = await getContent(cid);

  if (isEncrypted) {
    const decryptedContent = await decrypt(account, content);
    content = decryptedContent.message;
  }

  return content;
};

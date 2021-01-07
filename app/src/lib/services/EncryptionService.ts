import EthCrypto from 'eth-crypto';
import { Account } from 'web3-core';
import { IDecryptResult } from '../../@types/IEncryptedDocument';

const encrypt = async (account: Account, message: string, publicKey: string): Promise<string> => {
  const signature = EthCrypto.sign(account.privateKey, EthCrypto.hash.keccak256(message));

  const payload = {
    message,
    signature,
  };

  const encrypted = await EthCrypto.encryptWithPublicKey(publicKey, JSON.stringify(payload));

  return EthCrypto.cipher.stringify(encrypted);
};

const decrypt = async (account: Account, cipherText: string): Promise<IDecryptResult> => {
  const encrypted = EthCrypto.cipher.parse(cipherText);
  const decrypted = await EthCrypto.decryptWithPrivateKey(account.privateKey, encrypted);

  const decryptedPayload = JSON.parse(decrypted);

  const senderAddress = EthCrypto.recover(
    decryptedPayload.signature,
    EthCrypto.hash.keccak256(decryptedPayload.message),
  );

  return {
    message: decryptedPayload.message,
    sender: senderAddress,
  };
};

export { encrypt, decrypt };

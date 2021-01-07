export interface IDecryptResult {
  message: string;
  sender: string;
  json?: any;
}

export interface IEncryptedDocument {
  decryptedContent: IDecryptResult;
  encryptedContent: string;
}

import { bufferToHex } from 'ethereumjs-util';
import { encrypt as metaMaskEncrypt} from 'eth-sig-util';

const encrypt = async (message: string, publicKey: string): Promise<string> => {
  return bufferToHex(Buffer.from(
    JSON.stringify(
      metaMaskEncrypt(
        publicKey,
        { data: message },
        'x25519-xsalsa20-poly1305'
      )
    ),
    'utf8'
  ))
};

export { encrypt };

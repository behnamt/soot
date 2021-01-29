import IPFS from 'ipfs';

export interface IpfsContextInterface {
  ipfs: IPFS;
  isPending: boolean;
}

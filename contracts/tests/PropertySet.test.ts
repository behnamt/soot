import { stringToHex, hexToBytes, padRight } from 'web3-utils';
const { accounts, contract } = require('@openzeppelin/test-environment');
const { BN } = require('@openzeppelin/test-helpers');
const propertySet = contract.fromArtifact('PropertySet');

let contractInstance: any;

describe('PropertySet Contract', () => {
  const [deployer, user] = accounts;
  const hexMetadata = stringToHex('http://myURI.example');
  const metadataBytes = hexToBytes(hexMetadata);

  beforeEach(async () => {
    contractInstance = await propertySet.new({ from: deployer });
  });

  it('adds properties to set', async () => {
    await contractInstance.addProperty(1, user, metadataBytes);
    await contractInstance.addProperty(2, user, metadataBytes);

    const { tokenIds, owners, tokenURI } = await contractInstance.getAllProperties();

    expect(tokenIds.toString()).toEqual('1,2');
    expect(owners).toEqual([user, user]);

    const paddedHexMetadata = padRight(hexMetadata, 64);
    expect(tokenURI).toEqual([paddedHexMetadata, paddedHexMetadata]);
  });

  it('change property owner', async () => {
    await contractInstance.addProperty(1, deployer, metadataBytes);
    let propertyArray = await contractInstance.getAllProperties();
    expect(propertyArray.owners).toEqual([deployer]);

    await contractInstance.updateOwnerInPropertySet(1, user);
    propertyArray = await contractInstance.getAllProperties();
    expect(propertyArray.owners).toEqual([user]);
  })
});

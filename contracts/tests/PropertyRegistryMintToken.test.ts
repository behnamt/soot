const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const propertyRegistry = contract.fromArtifact('PropertyRegistry');

let contractInstance: any;

describe('PropertyRegistry Contract', () => {
  const name = 'PropertyRecord';
  const symbol = 'PRT';
  const [deployer, user] = accounts;


  beforeEach(async () => {
    contractInstance = await propertyRegistry.new({ from: deployer });
    contractInstance.initialize({ from: deployer });
  });

  describe('has a symbol and name', () => {
    it('name: PropertyRegistry', async () => {
      expect(await contractInstance.name()).toBe(name);
    });

    it('symbol: PRT', async () => {
      expect(await contractInstance.symbol()).toBe(symbol);
    });
  });

  describe('minting a token with metadata', () => {
    it('should mint two tokens, if I am the owner', async () => {
      const metadata = 'http://myURI.example';
      const previousBalance = await contractInstance.balanceOf(deployer);
      expect(previousBalance.toString()).toBe('0');

      const tokenId = await contractInstance.getNextTokenId();

      await contractInstance.mintToOwner(tokenId, 1, [10000], { from: deployer });
      await contractInstance.updateTokenURI(tokenId, metadata, { from: deployer });

      const nextBalance = await contractInstance.balanceOf(deployer);
      expect(nextBalance.toString()).toBe('2');

      const supply = await contractInstance.totalSupply();
      expect(supply.toString()).toBe('2');
      expect(await contractInstance.tokenURI(1)).toBe(metadata);
    });

    it('will fail, if I am not the owner', async () => {
      await expectRevert(
        contractInstance.mintToOwner('', 1, [10000], { from: user }),
        'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.'
      );
    });
  });
  
  describe('minting multiple ownership tokens', () => {
    it('should mint a property and an ownership token, if I am the owner', async () => {
      const metadata = 'http://myURI.example';
      const previousBalance = await contractInstance.balanceOf(deployer);
      expect(previousBalance.toString()).toBe('0');

      const tokenId = await contractInstance.getNextTokenId();      

      await contractInstance.mintToOwner(tokenId, 2, [5000,5000],  { from: deployer });
      await contractInstance.updateTokenURI(tokenId, metadata, { from: deployer });

      const nextBalance = await contractInstance.balanceOf(deployer);
      expect(nextBalance.toString()).toBe('3');

      const [ownershipTokens] = await contractInstance.getOwnershipsByProperty(1);
      
      expect(ownershipTokens.length).toBe(2);

      const supply = await contractInstance.totalSupply();
      expect(supply.toString()).toBe('3');
      expect(await contractInstance.tokenURI(1)).toBe(metadata);
    });

    it('will fail to update an ownership token URI', async () => {
      const metadata = 'http://myURI.example';

      const tokenId = await contractInstance.getNextTokenId();      

      await contractInstance.mintToOwner(tokenId, 2, [5000, 5000], { from: deployer });
      await contractInstance.updateTokenURI(tokenId, metadata, { from: deployer });

      expect(await contractInstance.tokenURI(2)).toBe('');
      
      await expectRevert(
        contractInstance.updateTokenURI(2, metadata, {from: deployer}),
        'Cannot update tokenURI for an ownership token'
      );
    });

    it('will fail, if I am not the owner', async () => {
      await expectRevert(
        contractInstance.mintToOwner(1, 5, [2000, 2000, 2000, 2000, 2000], { from: user }),
        'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.'
      );
    });
  });
});

const { accounts, contract, } = require('@openzeppelin/test-environment');
const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { sha3 } = require('web3-utils');
const sootToken = contract.fromArtifact('SootToken');
const sootRegistry = contract.fromArtifact('SootRegistry');

let sootTokenInstance: any;
let sootRegistryInstance: any;

describe('PropertyRegistry Contract', () => {
  const [Deployer, Alex, Bob] = accounts;


  beforeEach(async () => {
    sootTokenInstance = await sootToken.new({ from: Deployer });
    sootRegistryInstance = await sootRegistry.new(sootTokenInstance.address, { from: Deployer });
  });

  describe('Register', () => {
    it('should add an incident', async () => {
      const countBefore = await sootRegistryInstance.getTokenCount({ from: Alex });
      expect(Number(countBefore)).toEqual(0);
      const tokenId = await sootRegistryInstance.getNextTokenId();

      const receipt = await sootRegistryInstance.register(
        tokenId,
        sha3("a"),
        "some cid",
        false,
        123,
        456,
        789, { from: Alex }
      );
      const countAfter = await sootRegistryInstance.getTokenCount({ from: Alex });
      expect(Number(countAfter)).toStrictEqual(1);

      expectEvent(receipt, 'Register', {
        id: "1",
        _from: Alex,
        _name: sha3('a'),
        _cid: "some cid",
        _isEncrypted: false,
        _latitude: new BN(123),
        _longitude: new BN(456),
        _date: new BN(789)
      });
    });

    it('should add two incidents and getAllReports', async () => {
      const idsBefore = await sootRegistryInstance.getAllReports({ from: Alex });
      expect(idsBefore.length).toEqual(0);
      // first
      const firstTokenId = await sootRegistryInstance.getNextTokenId();
      await sootRegistryInstance.register(firstTokenId, sha3("some name"), "some cid", false, 123, 456, 789, { from: Alex });
      // second
      const secondTokenId = await sootRegistryInstance.getNextTokenId();
      await sootRegistryInstance.register(secondTokenId, sha3("some other name"), "some other cid", false, 1230, 4560, 7890, { from: Bob });
      // third
      const thirdTokenId = await sootRegistryInstance.getNextTokenId();
      await sootRegistryInstance.register(thirdTokenId, sha3("another one"), "some other cid", false, 1230, 4560, 7890, { from: Alex });

      const idsAfter = await sootRegistryInstance.getAllReports({ from: Alex });
      expect(idsAfter.length).toEqual(2);
      expect(idsAfter).toStrictEqual([firstTokenId, thirdTokenId]);
    });

    it('should get an incident by incident id', async () => {
      const tokenId = await sootRegistryInstance.getNextTokenId();
      await sootRegistryInstance.register(
        tokenId,
        sha3("a"),
        "some cid",
        false,
        123,
        456,
        789, { from: Alex }
      );
      const incident = await sootRegistryInstance.getIncident(1, { from: Alex });

      expect(incident.author).toBe(Alex);
      expect(incident.cid).toBe("some cid");
    });
  });
});

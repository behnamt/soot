const { accounts, contract, } = require('@openzeppelin/test-environment');
const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const sootToken = contract.fromArtifact('SootToken');
const sootRegistry = contract.fromArtifact('SootRegistry');

let sootTokenInstance: any;
let sootRegistryInstance: any;

describe('PropertyRegistry Contract', () => {
  const [deployer, user] = accounts;


  beforeEach(async () => {
    sootTokenInstance = await sootToken.new({ from: deployer });
    sootRegistryInstance = await sootRegistry.new(sootTokenInstance.address, { from: deployer });
    // await sootRegistryInstance.initialize({ from: deployer });
  });

  describe('Register', () => {
    it('should add an incident', async () => {
      const countBefore = await sootRegistryInstance.getTokenCount({ from: user });
      expect(Number(countBefore)).toEqual(0);
      const receipt = await sootRegistryInstance.register(
        "a",
        "some cid",
        false,
        123,
        456,
        789, { from: user }
      );
      const countAfter = await sootRegistryInstance.getTokenCount({ from: user });
      expect(Number(countAfter)).toStrictEqual(1);

      expectEvent(receipt, 'Register', {
        id: "1",
        _from: user,
        _name: "0x6100000000000000000000000000000000000000000000000000000000000000",
        _cid: "some cid",
        _isEncrypted: false,
        _latitude: new BN(123),
        _longitude: new BN(456),
        _date: new BN(789)
      });
    });
    
    it('should add two incidents and getAllIncidents', async () => {
      const idsBefore = await sootRegistryInstance.getAllReports({ from: user });
      expect(idsBefore.length).toEqual(0);
      // first
      await sootRegistryInstance.register("some name", "some cid", false, 123, 456, 789, { from: user });
      // second
      await sootRegistryInstance.register("a", "some other cid", false, 1230, 4560, 7890, { from: user });

      const idsAfter = await sootRegistryInstance.getAllReports({ from: user });
      expect(idsAfter.length).toEqual(2);
      expect(idsAfter.map((n: typeof BN) => n.toNumber())).toStrictEqual([1, 2]);
    });
  });
});

const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
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
      const countBefore = await sootRegistryInstance.getTokenCount({from: user});
      expect(Number(countBefore)).toEqual(0);
       await sootRegistryInstance.register(
        "some name",
        "some cid",
        false,
        123,
        456,
        789, {from: user}
       );
       const countAfter = await sootRegistryInstance.getTokenCount({from: user});
       expect(Number(countAfter)).toStrictEqual(1);
    });
  });
});

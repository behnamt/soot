const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const sootRegistry = contract.fromArtifact('SootRegistry');

let contractInstance: any;

describe('PropertyRegistry Contract', () => {
  const [deployer, user] = accounts;


  beforeEach(async () => {
    contractInstance = await sootRegistry.new({ from: deployer });
    await contractInstance.initialize({ from: deployer });
  });

  describe('Incidents', () => {
    it('should get all incidents', async () => {
      const allIncidents = await contractInstance.getAllIncidents();
      expect(allIncidents.length).toBe('0');
    });
  });
});

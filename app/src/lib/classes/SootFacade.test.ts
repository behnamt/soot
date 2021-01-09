import { accounts, contract } from '@openzeppelin/test-environment';

const [RegistryOwner] = accounts;
const SootRegistryContract = contract.fromArtifact('SootRegistry');
let sootRegistryContractInstance;

describe('SootFacade test', () => {
  beforeEach(async () => {
    sootRegistryContractInstance = await SootRegistryContract.new({ from: RegistryOwner });
    await sootRegistryContractInstance.initialize({ from: RegistryOwner });
  });

  describe('constraints', () => {
    it('can create a constraint', async () => {
      // write the first test here
      expect(true).toBe(true);
    });
  });
});

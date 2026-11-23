import { ethers } from 'hardhat';

const verifierAddress = process.env.VERIFIER_ADDRESS;
const root = process.env.INITIAL_HOSPITAL_ROOT;
if (!verifierAddress || !ethers.isAddress(verifierAddress) || !root || !/^0x[0-9a-fA-F]{64}$/.test(root)) {
  throw new Error('Set VERIFIER_ADDRESS and INITIAL_HOSPITAL_ROOT (bytes32) in your local environment. Never use a placeholder verifier.');
}
const Factory = await ethers.getContractFactory('MediProofSettlement');
const contract = await Factory.deploy(verifierAddress, root);
await contract.waitForDeployment();
console.log('MediProofSettlement deployed:', await contract.getAddress());

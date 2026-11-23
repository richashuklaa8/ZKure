import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MediProofSettlement', function () {
  async function fixture() {
    const [owner, recipient] = await ethers.getSigners();
    const Verifier = await ethers.getContractFactory('MockMediProofVerifier');
    const verifier = await Verifier.deploy();
    const root = ethers.zeroPadValue(ethers.toBeHex(123), 32);
    const Settlement = await ethers.getContractFactory('MediProofSettlement');
    const settlement = await Settlement.deploy(await verifier.getAddress(), root);
    await owner.sendTransaction({ to: await settlement.getAddress(), value: ethers.parseEther('1') });
    const commitment = ethers.zeroPadValue(ethers.toBeHex(456), 32);
    const nullifier = ethers.zeroPadValue(ethers.toBeHex(789), 32);
    const amount = ethers.parseEther('0.1');
    const publicInputs = [123n, 456n, 789n, amount, BigInt(recipient.address)];
    const proof = { a: [1n, 2n], b: [[3n, 4n], [5n, 6n]], c: [7n, 8n] };
    return { owner, recipient, verifier, settlement, commitment, nullifier, amount, publicInputs, proof };
  }
  it('settles only after verifier acceptance and marks the nullifier used', async function () {
    const f = await fixture();
    const before = await ethers.provider.getBalance(f.recipient.address);
    await f.settlement.verifyAndSettle(f.proof.a, f.proof.b, f.proof.c, f.publicInputs, f.nullifier, f.commitment, f.recipient.address, f.amount);
    expect(await ethers.provider.getBalance(f.recipient.address)).to.equal(before + f.amount);
    expect(await f.settlement.usedNullifiers(f.nullifier)).to.equal(true);
  });
  it('rejects a replayed nullifier', async function () {
    const f = await fixture();
    const args = [f.proof.a, f.proof.b, f.proof.c, f.publicInputs, f.nullifier, f.commitment, f.recipient.address, f.amount];
    await f.settlement.verifyAndSettle(...args);
    await expect(f.settlement.verifyAndSettle(...args)).to.be.revertedWithCustomError(f.settlement, 'NullifierAlreadyUsed');
  });
  it('rejects an invalid proof', async function () {
    const f = await fixture();
    await f.verifier.setResult(false);
    await expect(f.settlement.verifyAndSettle(f.proof.a, f.proof.b, f.proof.c, f.publicInputs, f.nullifier, f.commitment, f.recipient.address, f.amount)).to.be.revertedWithCustomError(f.settlement, 'InvalidProof');
  });
});

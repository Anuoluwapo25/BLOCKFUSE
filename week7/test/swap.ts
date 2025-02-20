import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SwapContract", function () {

    async function deploySwapFixture() {
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("ERC20Mock");
    const tokenA = await Token.deploy("TokenA", "TKA", owner.address, hre.ethers.parseEther("1000"));
    const tokenB = await Token.deploy("TokenB", "TKB", owner.address, hre.ethers.parseEther("1000"));

    const rate = hre.ethers.parseEther("1500");  // 1 tokenA = 1.5 tokenB

    const SwapContract = await hre.ethers.getContractFactory("SwapContract");
    const swapContract = await SwapContract.deploy(tokenA, tokenB, rate);

    return { swapContract, tokenA, tokenB, owner, addr1, addr2 };
  }

  it("Should deploy SwapContract and mock tokens correctly", async function () {
    const { swapContract, tokenA, tokenB, owner } = await loadFixture(deploySwapFixture);

    expect(await swapContract.tokenA()).to.equal(tokenA);
    expect(await swapContract.tokenB()).to.equal(tokenB);

    const ownerBalanceA = await tokenA.balanceOf(owner.address);
    const ownerBalanceB = await tokenB.balanceOf(owner.address);

    expect(ownerBalanceA).to.equal(hre.ethers.parseEther("1000"));
    expect(ownerBalanceB).to.equal(hre.ethers.parseEther("1000"));
  });

  it("Should allow token swapping", async function () {
    const { swapContract, tokenA, tokenB, owner, addr1 } = await loadFixture(deploySwapFixture);

    await tokenA.approve(swapContract, hre.ethers.parseEther("100"));
    await tokenB.approve(swapContract, hre.ethers.parseEther("100"));

    const swapAmount = hre.ethers.parseEther("100");
    await swapContract.swap(swapAmount);

    const ownerBalanceA = await tokenA.balanceOf(owner.address);
    const ownerBalanceB = await tokenB.balanceOf(owner.address);
    console.log(ownerBalanceB)

    expect(ownerBalanceA).to.equal(hre.ethers.parseEther("900"));
    expect(ownerBalanceB).to.equal(hre.ethers.parseEther("1150")); // 1.5 * 100 = 150, so 1000 - 150 = 1150
  });

  it("Should revert if insufficient balance for swap", async function () {
    const { swapContract, tokenA, tokenB, addr1 } = await loadFixture(deploySwapFixture);

   
    await tokenA.connect(addr1).approve(swapContract, hre.ethers.parseEther("100"));
    
    const swapAmount = hre.ethers.parseEther("100");
    await expect(swapContract.connect(addr1).swap(swapAmount))
      .to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

});

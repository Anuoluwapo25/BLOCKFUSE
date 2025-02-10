import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("BlockLabToken", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployErc20Token() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2] = await hre.ethers.getSigners();
  
      const BlockLabToken = await hre.ethers.getContractFactory("BlockLab");
      const BLTToken = await BlockLabToken.deploy();
  
      return { BLTToken, owner, account1, account2 };
    }
  
    describe("Deployment of BLT token contract", function () {
      it("Should deploy the token contract successfully", async function () {
        const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);
  
        const ownerBalance = await BLTToken.balanceOf(owner);
  
        const mintedToken = hre.ethers.parseUnits("100000", 18);
  
        expect(await ownerBalance).to.equal(mintedToken);
      });
  
      it("Should test for token holding of another account", async function () {
        const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);
  
        const ownerBalance = await BLTToken.balanceOf(account1);
  
        const mintedToken = hre.ethers.parseUnits("100000", 18);
  
        expect(await ownerBalance).to.equal(0);
      });
  
      it("Should test for token holding of another account in the case of inequality", async function () {
        const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);
  
        const ownerBalance = await BLTToken.balanceOf(account1);
  
        const mintedToken = hre.ethers.parseUnits("100000", 18);
  
        expect(await ownerBalance).to.not.equal(mintedToken);
      });
  
      it("Should test for token transfer and recieved token balance", async function () {
        const { BLTToken, owner, account1, account2 } = await loadFixture(deployErc20Token);
  
        const sendAmount = hre.ethers.parseUnits("10", 18);
        const senderBalance = hre.ethers.parseUnits("100000", 18);
  
        await BLTToken.transfer(account1, sendAmount);
  
        const ownerBalance = await BLTToken.balanceOf(owner);
  
        const account1Balance = await BLTToken.balanceOf(account1);
  
        await BLTToken.connect(account1).transfer
  
        expect(await ownerBalance).to.equal(senderBalance - sendAmount);
        expect(await account1Balance).to.equal(sendAmount);
      });
  
  
      it("Should test for token approve and allowance token balance", async function () {
        const { BLTToken, owner, account1, account2 } = await loadFixture(deployErc20Token);
  
        const approveAmount = hre.ethers.parseUnits("20", 18);
  
        const accountBalance = await BLTToken.balanceOf(account2);
  
        console.log("This is the balance of account2", accountBalance);
  
        const approveStatus = await BLTToken.connect(account2).approve(account1, approveAmount);
  
        const allowanceValue = await BLTToken.allowance(account2, account1);
  
        const falseApproveAmount = hre.ethers.parseUnits("21", 18);
  
        expect(allowanceValue).to.eq(0);
  
      });
  
  
  
      
    });
  
    
  });
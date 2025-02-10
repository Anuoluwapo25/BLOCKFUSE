import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("EventTicket", function () {
    async function deployErc20Token() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2] = await hre.ethers.getSigners();
  
      const EventTicketToken = await hre.ethers.getContractFactory("EventTicket");
      const EVTToken = await EventTicketToken.deploy();
  
      return { EVTToken, owner, account1, account2 };
    }
  
    describe("Deployment of EVT token contract", function () {
      it("Should test that the owner is correctly set to the account that deployed the contract", async function () {
        const { EVTToken, owner } = await loadFixture(deployErc20Token);
  
        expect(await EVTToken.owner()).to.equal(owner.address);
      });
    });
})
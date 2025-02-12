import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import  hre  from "hardhat";
import { stakePoolSol } from "../typechain-types/contracts";

describe("StakingToken", function() {
    async function deployStake() {
        const [owner, account1, account2] = await hre.ethers.getSigners();

        const StakingToken = await hre.ethers.getContractFactory("StakingToken");
        const stakeToken = await StakingToken.deploy();

        const RewardToken = await hre.ethers.getContractFactory("StakingToken");
        const rewardToken = await RewardToken.deploy();
        
        // const stakeToken = await deployToken()
   
        const Stakingpool = await hre.ethers.getContractFactory("StakingPool");
        const stakingpool = await Stakingpool.deploy(stakeToken.target, rewardToken.target);
    
        return { stakeToken, rewardToken, stakingpool, owner, account1, account2 };
    }
    
    describe("StakeToken", function () {
        it("should check if tokens are staked", async function () {
            const { stakeToken, stakingpool, owner } = await loadFixture(deployStake);
        
            const spendAmount = hre.ethers.parseUnits("15", 18);
        
            const allowanceBefore = await stakeToken.allowance(owner.address, stakingpool);
            await stakeToken.connect(owner).approve(stakingpool, spendAmount);
        
            const allowanceAfter = await stakeToken.allowance(owner.address, stakingpool);
            expect(allowanceAfter).to.equal(spendAmount, "Allowance should update after approval");
        
            await stakingpool.connect(owner).stake(spendAmount);
        
            const stakedAmount = await stakeToken.balanceOf(stakingpool);
            expect(stakedAmount).to.equal(spendAmount, "Staked amount should match spendAmount");
        
    
            await expect(stakingpool.connect(owner).stake(0)).to.revertedWith("Staked amount must be greater than zero");
        
            console.log("Allowance after staking:", allowanceAfter.toString());
            console.log("Allowance be staking:", allowanceBefore.toString());
            console.log("Staking info:", stakingpool.getStakeInfo);
        });

        it("should check total staked amount", async function() {
            const { stakeToken, stakingpool, owner, account1 } = await loadFixture(deployStake);
        
            const spendAmount1 = hre.ethers.parseUnits("2", 18);
            const spendAmount2 = hre.ethers.parseUnits("15", 18);

            await stakeToken.connect(owner).transfer(account1.address, spendAmount2);
        
            await stakeToken.connect(owner).approve(stakingpool, spendAmount1);
            await stakingpool.connect(owner).stake(spendAmount1);
   
            await stakeToken.connect(account1).approve(stakingpool, spendAmount2);
            await stakingpool.connect(account1).stake(spendAmount2);
        
            const total = await stakingpool.totalStaked();
            
            expect(total).to.eq(spendAmount1 +spendAmount2);
        });
        
    });

        
})
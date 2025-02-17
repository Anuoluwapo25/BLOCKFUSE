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
        const stakingpool1 = await Stakingpool.deploy(stakeToken.target, rewardToken.target);
    
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
            const stakeInfo = await stakingpool.getStakeInfo(owner.address);
            console.log("Staking info:", stakeInfo);

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
        it("should only claim if Timestamp is greater than OR equals LOCK_PERIOD", async function () {
            const { stakeToken, stakingpool, owner, account1} = await loadFixture(deployStake);

            const spendAmountowner = hre.ethers.parseUnits("20", 18);
            await stakeToken.connect(owner).approve(account1, spendAmountowner);
            const allowance1 = await stakeToken.allowance(owner, account1)
            await stakeToken.connect(owner).transfer(account1, spendAmountowner);
            const bal = await stakeToken.balanceOf(account1);
            console.log("allowance:", allowance1);
            console.log("bal:", bal)
            
            const spendAmount = hre.ethers.parseUnits("15", 18);
            await stakeToken.connect(account1).approve(stakingpool, spendAmount);
            const allowance2 = await stakeToken.allowance(account1, stakingpool)
            
            console.log("allowance2:", allowance2)

            const updatedBlock = await hre.ethers.provider.getBlock("latest");

            const stake = await stakingpool.connect(account1).stake(spendAmount); 
            console.log("Staked Amount:", stake);
            const daysStaked = 7;
            await hre.ethers.provider.send("evm_increaseTime", [daysStaked * 24 * 60 * 60]);
            await hre.ethers.provider.send("evm_mine");

            const REWARD_PER_DAY = hre.ethers.parseUnits("10", 18);
            const rewardAmount = REWARD_PER_DAY * BigInt(daysStaked);
        
            const rewards = await stakingpool.calculateRewards(account1);
            console.log(rewards)
            console.log("Calculated Rewards:", rewards.toString());
        
            expect(rewards).to.eq(rewardAmount); 
        });
        
        it("should check if staker exist before unstaking", async function() {

            const { stakeToken, stakingpool, owner } = await loadFixture(deployStake);
        
            const spendAmount = hre.ethers.parseUnits("15", 18);
        
            await stakeToken.connect(owner).approve(stakingpool, spendAmount);
            await stakingpool.connect(owner).stake(spendAmount);

            await hre.ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);



        })

    });

        
})
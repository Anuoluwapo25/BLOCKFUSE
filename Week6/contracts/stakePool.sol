// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingPool is Ownable(msg.sender) {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    uint256 public constant LOCK_PERIOD = 7 days;
    uint256 public constant REWARD_PER_DAY = 10 * 10**18; 
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewards;
        bool exists;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }
    
    function stake(uint256 _amount) external {
        require(_amount > 0, "Staked amount must be greater than zero");
        require(!stakes[msg.sender].exists, "Already staking");
        
        
        stakes[msg.sender] = Stake({
            amount: _amount,
            timestamp: block.timestamp,
            rewards: 0,
            exists: true
        });
        
        totalStaked = totalStaked + _amount;
        
        IERC20(stakingToken).transferFrom(msg.sender, address(this), _amount);

        emit Staked(msg.sender, _amount);
    }
    
    function calculateRewards(address _staker) public view returns (uint256) {
        if (!stakes[_staker].exists) return 0;
        
        Stake memory userStake = stakes[_staker];
        uint256 timeStaked = block.timestamp - userStake.timestamp;
        
        if (timeStaked < LOCK_PERIOD) return 0;
        
        // uint256 numberOfDays = timeStaked / 86400;
        // uint256 rewardAmount = REWARD_PER_DAY * numberOfDays;

        uint256 rewardAmount = (REWARD_PER_DAY * timeStaked) / 86400;
        return rewardAmount;
    }
    
    function unstake() external {
        require(stakes[msg.sender].exists, "No active stake");
        require(block.timestamp >= stakes[msg.sender].timestamp + LOCK_PERIOD,
                "Lock period not over");
        
        Stake memory userStake = stakes[msg.sender];  
        uint256 rewardAmount = calculateRewards(msg.sender);
        uint256 stakeAmount = userStake.amount;
        
        totalStaked = totalStaked - stakeAmount;
        delete stakes[msg.sender];
        
        IERC20(stakingToken).transfer(msg.sender, stakeAmount);
                
        if (rewardAmount > 0) {
            require(rewardToken.transfer(msg.sender, rewardAmount),
                    "Reward transfer failed");
            emit RewardsClaimed(msg.sender, rewardAmount);
        }
        
        emit Unstaked(msg.sender, stakeAmount);
    }
    
    function getStakeInfo(address _staker) external view returns (
        uint256 amount,
        uint256 timestamp,
        uint256 rewards,
        bool exists
    ) {
        Stake memory userStake = stakes[_staker];  
        return (
            userStake.amount,
            userStake.timestamp,
            calculateRewards(_staker),
            userStake.exists
        );
    }
    
    function withdrawRewardTokens(uint256 _amount) external onlyOwner {
        require(rewardToken.transfer(owner(), _amount), "Transfer failed");
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapContract {
    IERC20 public tokenA;
    IERC20 public tokenB;
    address public owner;
    uint256 public rate; 

    event Swap(address indexed user, uint256 amountA, uint256 amountB);

    constructor(address _tokenA, address _tokenB, uint256 _rate) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        owner = msg.sender;
        rate = _rate;
    }

    function swap(uint256 amountA) external {
        require(amountA > 0, "Amount must be greater than zero");

        uint256 amountB = amountA * rate;
        require(tokenB.balanceOf(address(this)) >= amountB, "Not enough liquidity");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transfer(msg.sender, amountB);

        emit Swap(msg.sender, amountA, amountB);
    }

    function depositTokenB(uint256 amount) external {
        require(msg.sender == owner, "Only owner can deposit");
        tokenB.transferFrom(msg.sender, address(this), amount);
    }
}

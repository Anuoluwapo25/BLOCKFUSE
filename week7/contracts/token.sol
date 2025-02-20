// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    // Constructor to mint initial tokens to a specific account
    constructor(string memory name, string memory symbol, address initialAccount, uint256 initialBalance) 
        ERC20(name, symbol) 
    {
        _mint(initialAccount, initialBalance);
    }

    // Optional: You can add minting functionality if needed for testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EventTicket is ERC20("EventTicket") {
    address public owner;
    uint256 public ticketPrice = 0.05 ether; 
    uint256 public totalTickets = 100;
    uint256 public ticketsSold;

    // event TicketPurchased(address indexed buyer, uint256 amount);

    constructor() {
    owner = msg.sender; 
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    } 

    function buyTicket(uint256 amount) public payable {
        require(amount > 0, "Must buy at least one ticket");
        require(msg.value == ticketPrice * amount, "Incorrect payment");
        require(ticketsSold + amount <= totalTickets, "Not enough tickets available");

        _mint(msg.sender, amount);
        ticketsSold += amount;

        // emit TicketPurchased(msg.sender, amount);
    }

    function verifyTicket(address attendee, uint256 ticketAmount) public view returns (bool) {
        return balanceOf(attendee) >= ticketAmount;
    }
}
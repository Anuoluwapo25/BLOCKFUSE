// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;


contract Day1 {
    //state variables
    string name;
    address public  walletAddress;
    uint8 public age;
    bool isMarried;

    function setName(string memory _name) public {
        name = _name;
    }

       function setAge(uint8 age) public {
        age = age;
    }
    
    function getAge() public view returns(uint8) {
        return age;
    }

}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Parent {
    uint public num;
    string public name = "Deborah";

    function setNumber(uint _num) public {
        num = _num;
    }
    
    function changeName(string memory _name) public virtual  {
        name = _name;
    }

//notice that the setname will not show in the child
    function setName(string memory _name) private{
        name = _name;
    }

}
 
 contract Child is Parent{
    function changeName(string memory _name) public  override {
        name = _name;
    }
 }
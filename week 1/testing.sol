//SPDX-Liencse-Identifier: MIT

pragma solidity ^0.8.8


contract StudentManagement {
    address = owner

    constructor {
        owner = msg.sender
    }

    modifier onlyOwner{
        if msg.sender != owner ("you are not an admin)
    }

    mapping (uint8 -> struct) students;
    uint8 studentid public;

    struct public Student {
        uint8 age;
        string name;
        string grade;
    }


    function addStudent(
        uint8 _age
        string memory _name
        string memory _grade)
        external onlyOwner {
            Student memory student = Student {(
                age: _age
                name: _name
                grade: _grade
            )};

            studentid++
            Students[studentid] = student

        }
        emit addStudent(_age, _name, _grade)
    }

    function getStudent(uint8 studentid) public view return(Student memory student) {
        students[studentid] = student
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract StudentManagement {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the admin");
        _;
    }

    enum Gender { Male, Female }
    enum Status { Active, Inactive, Graduated, Suspended }

    mapping(uint256 => string) name;
    mapping(uint8 => Student) students;
    mapping(uint8 => bool) public isDeleted; 

    // Events
    event CreatedStudent(
        string indexed name,
        string indexed class,
        uint8 indexed age
    );
    event UpdatedStudent(uint8 indexed studentId, string newClass);
    event StudentStatusChanged(uint8 indexed studentId, Status newStatus);
    event DeletedStudent(uint8 indexed studentId);

    struct Student {
        string name;
        uint8 age;
        string class;
        Gender gender;
        Status status;
        uint256 enrollmentDate;
    }

    uint8 studentId = 0;

    function registerStudent(
        string memory _name,
        uint8 _age,
        string memory _class,
        Gender _gender
    ) external onlyOwner {
        Student memory student = Student({
            name: _name,
            age: _age,
            class: _class,
            gender: _gender,
            status: Status.Active,
            enrollmentDate: block.timestamp
        });
        
        studentId++;
        students[studentId] = student;
        
        emit CreatedStudent(_name, _class, _age);
    }

    function updateStudentClass(uint8 _studentId, string memory _newClass) external onlyOwner {
        require(_studentId > 0 && _studentId <= studentId, "Invalid student ID");
        require(!isDeleted[_studentId], "Student has been deleted");
        
        students[_studentId].class = _newClass;
        emit UpdatedStudent(_studentId, _newClass);
    }

    function changeStudentStatus(uint8 _studentId, Status _newStatus) external onlyOwner {
        require(_studentId > 0 && _studentId <= studentId, "Invalid student ID");
        require(!isDeleted[_studentId], "Student has been deleted");
        
        students[_studentId].status = _newStatus;
        emit StudentStatusChanged(_studentId, _newStatus);
    }

    function deleteStudent(uint8 _studentId) external onlyOwner {
        require(_studentId > 0 && _studentId <= studentId, "Invalid student ID");
        require(!isDeleted[_studentId], "Student already deleted");
        
        isDeleted[_studentId] = true;
        emit DeletedStudent(_studentId);
    }

    function getStudent(uint8 _studentId) public view returns (Student memory student_) {
        require(!isDeleted[_studentId], "Student has been deleted");
        student_ = students[_studentId];
    }

    function getStudents() public view returns (Student[] memory students_) {
        uint8 activeCount = 0;
        

        for (uint8 i = 1; i <= studentId; i++) {
            if (!isDeleted[i]) {
                activeCount++;
            }
        }
        
        students_ = new Student[](activeCount);
        uint8 currentIndex = 0;
        
        for (uint8 i = 1; i <= studentId; i++) {
            if (!isDeleted[i]) {
                students_[currentIndex] = students[i];
                currentIndex++;
            }
        }
    }
}
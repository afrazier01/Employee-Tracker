//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const questions = [
    {
        type: 'list',
        name: 'query_type',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update an employee role','Quit']
    }
];

const departmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the new department?'
    }
];

const roleQuestions = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the new role?'
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the new role?'
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'Which department does the role belong to?',
        choices: ["IT", "Finance","Sales","Legal","Procurement"]
    }
];

module.exports = {questions, departmentQuestions, roleQuestions};
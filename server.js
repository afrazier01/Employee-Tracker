const inquirer = require('inquirer');
const {questions,departmentQuestions, roleQuestions} = require('./helpers/questions');
const mysql = require('mysql2');
const { runInContext } = require('vm');
const cTable = require('console.table');
const { get } = require('http');
const { title } = require('process');
let currentDepartments;
let roleDepartmentID;
let currentManagers;


const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
    },
    console.log('Connected to the employees database.')
);

//Helper function that perform queries
function viewEmployees () {
    return new Promise((resolve, reject) => {
        db.query(`SELECT 
                    employees.id ID, 
                    employees.first_name First_Name, 
                    employees.last_name Last_Name, 
                    roles.title Job_Title, 
                    departments.name Department, 
                    roles.salary Salary, 
                    CONCAT(m.first_name,' ',m.last_name) Manager

                FROM 
                    employees 
                INNER JOIN 
                    roles 
                        ON employees.role_id = roles.id 
                INNER JOIN 
                    departments 
                        ON roles.department_id = departments.id
                LEFT JOIN
                    employees m
                        ON employees.manager_id = m.id;`, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    });
};

function viewDepartments () {
    return new Promise((resolve, reject) => {
        db.query
        (`SELECT 
            departments.name Department, 
            departments.id ID 
        FROM 
            departments`, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    });
};

function viewRoles () {
    return new Promise((resolve, reject) => {
        db.query
        (`SELECT 
            roles.title Job_Titles, 
            roles.id ID, 
            departments.name Department, 
            roles.salary Salary 
        FROM 
            roles 
        INNER JOIN 
            departments 
                ON roles.department_id = departments.id;`, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    });
};

function addDepartment (department) {
    return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO departments (name) VALUES (?)`,[department],(err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    })
}

function addRole (roleName, roleSalary, roleDepartment) {
    return new Promise ((resolve, reject) => {
        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',[roleName, roleSalary, roleDepartment],(err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    })
}

function addEmployee (firstName, lastName, employeeRole, employeeManager) {
    return new Promise ((resolve, reject) => {
        db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES  (?,?,?,?);',[firstName, lastName, employeeRole, employeeManager],(err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    })
}

function runApp () {
    inquirer.prompt(questions).then((res) => {
    const {query_type} = res
    

    if (query_type === 'Quit') {
        console.log(`\n\n`);
        return console.log('Closing Content Management System. Have a great day!') 
    }
    if (query_type === 'View all employees') {
        viewEmployees().then((employees)=>{
            console.log(`\n\n`);
            console.table(employees)});
            console.log(`\n\n`);
        runApp();
    }
    if (query_type === 'View all departments') {
        viewDepartments().then((departments)=>{
            console.log(`\n\n`);
            console.table(departments)});
            console.log(`\n\n`);
        runApp();
    }
    if (query_type === 'View all roles') {
        viewRoles().then((roles)=>{
            console.log(`\n\n`);
            console.table(roles)});
            console.log(`\n\n`);
        runApp();
    }
    if (query_type === 'Add department') {
        inquirer.prompt(departmentQuestions).then((res) => {
            const {departmentName} = res

            console.log(`\n`);
            addDepartment(departmentName).then(console.log(`${departmentName} was successfully added to the database!`))
            runApp();
        });
    }
    if (query_type === 'Add role') {
        db.query
        (`SELECT 
            departments.name,
            departments.id
        FROM 
            departments`, (err, results) => {
            if (err) {
                return console.error(err);
            }
            
            currentDepartments = results.map(({name,id}) => ({name,id}));
            console.log(currentDepartments)
        
            inquirer.prompt([
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
                    choices: currentDepartments
            }])
            .then((res) => {
            const {roleName, roleSalary, roleDepartment} = res
            
            for (let i=0;i<currentDepartments.length; i++) {
                if (currentDepartments[i].name===roleDepartment) {
                    roleDepartmentID = currentDepartments[i].id
                }
            }
             
            console.log(`\n`);
            addRole(roleName, roleSalary, roleDepartmentID).then(console.log(`${roleName} was successfully added to the database!`))
            runApp();
            })
        });
    }
    if (query_type === 'Add employee') {
        db.query
        (`SELECT 
            roles.title,
            roles.id,
            employees.id ID,
            CONCAT(employees.first_name,' ',employees.last_name) manager
        FROM 
            employees
        INNER JOIN
            roles
                ON employees.role_id = roles.id;`, (err, results) => {
            if (err) {
                return console.error(err);
            }
            
            currentManagers = results.map(({manager}) => manager);
            
            currentRoles = results.map(({title}) => title);
            
            const currentRoleIDs = results.map(({id,title}) => id,title);
            
            
            
        
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: "Which role do you want to assign to the selected employee?",
                    choices: currentRoles
                },
                {
                    type: 'list',
                    name: 'employeeManager',
                    message: "Who is the employee's manager?",
                    choices: currentManagers
                }
            ])
            .then((res) => {
            const {firstName, lastName, employeeRole, employeeManager} = res
            
            for (let i=0;i<results.length; i++) {
                if (results[i].title===employeeRole) {
                    newEmployeeRoleID = results[i].id
                }
                if (results[i].manager===employeeManager) {
                    newEmployeeManagerID = results[i].ID 
                }
            }
            console.log(newEmployeeRoleID)
            console.log(newEmployeeManagerID)


            console.log(`\n`);
            addEmployee(firstName, lastName, newEmployeeRoleID, newEmployeeManagerID).then(console.log(`${firstName} was successfully added to the database!`))
            runApp();
            })
        });
    }
    if (query_type === 'Update an employee role') {
       
    }
    });
};

runApp();


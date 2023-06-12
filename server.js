const inquirer = require('inquirer');
const {questions,departmentQuestions, roleQuestions} = require('./helpers/questions');
const mysql = require('mysql2');
const { runInContext } = require('vm');
const cTable = require('console.table');
const { get } = require('http');
let currentDepartments;
let roleDepartmentID;


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

//Not sure if data types will matter. salary and department such be int
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
    }
    if (query_type === 'Update an employee role') {
       
    }
    });
};

runApp();


const inquirer = require('inquirer');
const questions = require('./helpers/questions');
const mysql = require('mysql2');
const { runInContext } = require('vm');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
    },
    console.log('Connected to the employees database.')
);

function viewEmployees () {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM employees`, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    });
};

function viewDepartments () {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM departments`, (err, results) => {
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
        (`
        SELECT 
                title
            ,   salary
            ,   department_id
            ,   id
        FROM 
            roles
         `, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results);
        }); 
    });
};

function runApp () {
    inquirer.prompt(questions).then((res) => {
    const {query_type} = res
    
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
    });
};

runApp();




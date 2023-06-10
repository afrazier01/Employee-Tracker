const inquirer = require('inquirer');
const questions = require('./helpers/questions');
const mysql = require('mysql2');

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

inquirer.prompt(questions).then((res) => {
    const {query_type} = res
    
    if (query_type === 'View all departments') {
        viewEmployees().then((employees)=>console.log(employees));
    }
});





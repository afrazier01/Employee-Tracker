const inquirer = require('inquirer');
const questions = require('./helpers/questions');
 
inquirer.prompt(questions).then((res) => {
    const {query_type} = res
    console.log(query_type)
    
});



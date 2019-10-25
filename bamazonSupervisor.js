require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const {printTable} = require('console-table-printer');

// let inventory = [];

var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: "bamazon"
});

//establish connection to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  
  //run menu function to see available menu options on screen.
  menu();
});

//display menu options
function menu() {
    //List a set of menu options:
    inquirer.prompt({
        name: "menuChoice",
        type: "list",
        message: "What function do you want to perform?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }).then(function(answer) {

        switch(answer.menuChoice) {
            case "View Product Sales by Department": 
                console.log("view product function should run here.");
                connection.end();
                break;
            
            case "Create New Department":
                newDept();
                break;
            
            case "Exit":
                console.log("You are exiting the app."); 
                connection.end();
                break;
        }
    });
}


// View Product Sales by Department
function viewSales() {

}

// Create New Department
function newDept() {
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of the department?"
        },
        {
            name: "overheadCost",
            type: "number",
            message: "How much is the overhead cost for this department?",
            validate: function(value) {
                if(isNaN(value)==false) {
                  return true;
                } else {
                  return false;
                }        
            }
        }
    ])
    .then(function(answer) {
        console.log("Inserting a new department...\n");
        var query = connection.query(
        "INSERT INTO departments SET ?", 
        {
            department_name: answer.departmentName,
            over_head_costs: answer.overheadCost
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            connection.end();
        }
        );
    });
}

//Create a table
// const testCases = [
//     { index: 3, text: 'I would like some gelb bananen bitte', value: 100 },
//     { index: 4, text: 'I hope batch update is working', value: 300 }
// ];
 
// //print
// printTable(testCases);
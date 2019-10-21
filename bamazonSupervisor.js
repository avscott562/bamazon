require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");

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
                break;
            
            case "Create New Department":
                console.log("create new department function should run here.")
                break;
            
            case "Exit":
                console.log("You are exiting the app."); 
                connection.end();
                break;
        }
    });
}



// Modify the products table so that there's a product_sales column, and modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.



// Make sure your app still updates the inventory listed in the products column.


// View Product Sales by Department
// Create New Department
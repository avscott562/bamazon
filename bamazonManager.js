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
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function(answer) {
        console.log(answer.menuChoice);
        switch(answer.menuChoice) {
            case "View Products for Sale": 
                //run view products function;
                console.log("view product worked");
                break;
            
            case "View Low Inventory":
                //run view low inventory function;
                console.log("view low inventory worked");
                break;
            
            case "Add to Inventory":
                //run add inventory function;
                console.log("add inventory worked");
                break;
            
            case "Add New Product":
                inquirer.prompt([
                    {
                        name: "productName",
                        type: "input",
                        message: "What is the name of the product?"
                    },
                    {
                        name: "departmentName",
                        type: "input",
                        message: "What is the name of the department?"
                    },
                    {
                        name: "price",
                        type: "number",
                        message: "What is the price of the product?",
                        validate: function(value) {
                            if(isNaN(value)==false) {
                              return true;
                            } else {
                              return false;
                            }        
                        }
                    },
                    {
                        name: "stock",
                        type: "input",
                        message: "How many are in stock?",
                        validate: function(value) {
                            if(isNaN(value)==false) {
                              return true;
                            } else {
                              return false;
                            }        
                        }
                    }
                ]).then(function(answer) {
                console.log("add product worked");
                //run addProduct function;
                addProduct(answer.productName, answer.departmentName, answer.price, answer.stock);
                });
                break;

            case "Exit":
                console.log("You are exiting."); 
                connection.end();
                break;
        }
    });
}


// allow the manager to add a completely new product to the store.
function addProduct(product, dept, price, qty) {
    console.log("Inserting a new product...\n");
    var query = connection.query(
      "INSERT INTO products SET ?", 
      {
        product_name: product,
        department_name: dept,
        price: price,
        stock_quantity: qty
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
        // Call updateProduct AFTER the INSERT completes
        // updateProduct();
      }
    );
  
    // logs the actual query being run
    // console.log(query.sql);
    connection.end();
    }
  
  // function deleteProduct() {
  //   console.log("Deleting all strawberry icecream...\n");
  //   connection.query(
  //     "DELETE FROM products WHERE ?",
  //     {
  //       flavor: "strawberry"
  //     },
  //     function(err, res) {
  //       if (err) throw err;
  //       console.log(res.affectedRows + " products deleted!\n");
  //       // Call readProducts AFTER the DELETE completes
  //       readProducts();
  //     }
  //   );
  // }



// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

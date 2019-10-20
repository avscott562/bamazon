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
                addProduct();
                break;

            case "Exit":
                console.log("You are exiting."); 
                connection.end();
                break;
        }
    });
}


// allow the manager to add a completely new product to the store.
function addProduct() {
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
    ])
    .then(function(answer) {
        console.log("Inserting a new product...\n");
        var query = connection.query(
        "INSERT INTO products SET ?", 
        {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.price,
            stock_quantity: answer.stock
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            connection.end();
        }
        );
    })
}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function updateInventory(qty, amount, id) {
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {
          stock_quantity: qty + amount
        },
        {
          item_id: id
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        // deleteProduct();
      })
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

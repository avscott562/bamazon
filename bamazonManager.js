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

  console.log("Displaying all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log(res);
        //run menu function to see available menu options on screen.
        menu();
    });
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
                lowInventory();
                break;
            
            case "Add to Inventory":
                updateInventory();
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
function updateInventory() {

    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        let products = res;
        inquirer.prompt([
            {
                name: "itemId",
                type: "number",
                message: "What is the item_id of the product you want to update?",
                validate: function(value) {
                    if(isNaN(value)==false) {
                      return true;
                    } else {
                      return false;
                    }
                  }
            },
            {
                name: "qty",
                type: "number",
                message: "How much are you adding the inventory?",
                validate: function(value) {
                    if(isNaN(value)==false) {
                      return true;
                    } else {
                      return false;
                    }
                  }
            }
        ]).then(function(answer) {
            for (i=0; i<res.length; i++) {
                if(answer.itemId === res[i].item_id) {
                    console.log("got em!");
                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                        stock_quantity: res[i].stock_quantity + answer.qty
                        },
                        {
                        item_id: res[i].item_id
                        }
                    ],
                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " products updated!\n");
                        connection.end();
                    })
                }
            }
        });
    })
    
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if(err) throw err;
        switch(res.length) {
            case 0:
                console.log("We are fully stocked on all items!");
                break;
            
            case 1:
                console.log("There is 1 item that needs to be restocked.\n");
                console.log(res);
                break;
            
            default:
                console.log("There are " + res.length + " items that need to be restocked.\n");
                console.log(res);
                break;

        }
        // if(res.length > 0) && (res.length < 2) {
        //     console.log("These item(s) need to be restocked...\n");
        //     console.log(res);
        // } else {
            
        // }
        connection.end();
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


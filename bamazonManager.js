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

        switch(answer.menuChoice) {
            case "View Products for Sale": 
                viewProducts();
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
                console.log("You are exiting the app."); 
                connection.end();
                break;
        }
    });
}


// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    console.log("Displaying all products available for sale.\n");
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
        if(err) throw err;
        for(i=0; i<res.length; i++) {
            console.log("Item ID: " + res[i].item_id + "\n", "Product: " + res[i].product_name + "\n", "Price: $" + res[i].price.toFixed(2) + "\n", "Quantity Available: " + res[i].stock_quantity + "\n\n");
        }
        connection.end();
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
        }
        );

        var allQuery = connection.query("SELECT department_name FROM departments", function(err, result) {
            if (err) throw err;

            let found = 0
            
            for (i=0; i<result.length; i++) {
                if (answer.departmentName === result[i].department_name) {
                    console.log("found it!");
                    found++;
                }
            }

            if(found > 0) {
                console.log("Department exists");
                connection.end();
            } else {
                console.log("Inserting a new department...\n");
                
                inquirer.prompt(
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
                )
                .then(function(newAnswer) {
                    console.log(answer.departmentName);
                    console.log(newAnswer.overheadCost);
                    let deptQuery = connection.query(
                    "INSERT INTO departments SET ?", 
                    {
                        department_name: answer.departmentName,
                        over_head_costs: newAnswer.overheadCost
                    }, 
                    function(error, newRes) {
                        if (err) throw err;
                        console.log(newRes.affectedRows + " department added!\n");
                        connection.end();
                    })
                });
            };
        });
    });
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
        connection.end();
    })
}

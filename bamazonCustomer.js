require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");

let inventory = [];

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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  display();
});

// Instructions

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function display() {
  console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      //display all of the items available for sale.
      for (i=0; i<res.length; i++) {
        //checks if quantity is available for sale and add to inventory if any in stock.
        if (res[i].stock_quantity > 0) {
          let product = new Product(res[i].item_id, res[i].product_name, res[i].price);
          inventory.push(product);
        }
      }
      //checks if any items are available for sale and displays them if they are.
      if (inventory.length > 0) {
        console.log(inventory);
      } else {
        //if no items available for sale, end connection to database
        connection.end();
      }

      // The app should then prompt users with two messages.
      purchase();
    });
}


function purchase() {
  //get items from datbase
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    // The first should ask them the ID of the product they would like to buy.
    inquirer
      .prompt({
        name: "Item_id",
        type: "input",
        message: "What is the item id of the product you would like to purchase?",
        validate: function(value) {
          if(isNaN(value)==false) {
            return true;
          } else {
            return false;
          }
        }
      })
      .then(function(answer) {
        //check to see if it is a valid item id
        let validItemIds = [];
        for (c=0; c<res.length; c++) {
          validItemIds.push(parseInt(res[c].item_id));
        }
        console.log(validItemIds + " valid");
        let inList = validItemIds.indexOf(parseInt(answer.Item_id));
        console.log(inList + " in list");
        //if it is a valid item id, ask user for quantity to purchase
        if(inList !== -1) {
          for (i=0; i<res.length; i++) {
            if(res[i].item_id == answer.Item_id) {
              let selectedItem = res[i];
              if (selectedItem.stock_quantity > 0) {
                // The second message should ask how many units of the product they would like to buy.
                inquirer
                .prompt({
                  name: "quantity",
                  type: "input",
                  message: "How many units would you like to buy?",
                  default: 1,
                  validate: function(value) {
                    if(isNaN(value)==false) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                })
                .then(function(answer) {
                  if (selectedItem.stock_quantity <= answer.quantity) {
                    console.log("Yay!  We have enough in stock.");
                  } else {
                    console.log("Sorry, we do not have enough to fulfilll your order.");
                  }
                })
              } else {
                console.log(selectedItem.product_name + " is out of stock.");
                connection.end();
              }
              
            }
          }
        } else {
          console.log("Please select a valid Item ID.");
          purchase();
        }
      });

  })
  // The first should ask them the ID of the product they would like to buy.
  // inquirer
  //   .prompt([
  //     {
  //       name: "Item_id",
  //       type: "input",
  //       message: "What is the item id of the product you would like to purchase?",
  //       validate: function(value) {
  //         if(isNaN(value)==false) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //     },
  //     // The second message should ask how many units of the product they would like to buy.
  //     {
  //       name: "quantity",
  //       type: "input",
  //       message: "How many units would you like to buy?",
  //       default: 1,
  //       validate: function(value) {
  //         if(isNaN(value)==false) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //     }
  //   ])
  //   .then(function(answer) {
  //     console.log("You selected item " + answer.Item_id + ".");
  //     console.log("You want to buy " + answer.quantity + " units of this product.");
  //   });
    // connection.end();
}



// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.



// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



// However, if your store does have enough of the product, you should fulfill the customer's order.


// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
  


  // function createProduct() {
  //   console.log("Inserting a new product...\n");
  //   var query = connection.query(
  //     "INSERT INTO products SET ?", 
  //     {
  //       flavor: "Rocky Road",
  //       price: 3.0,
  //       quantity: 50
  //     },
  //     function(err, res) {
  //       if (err) throw err;
  //       console.log(res.affectedRows + " product inserted!\n");
  //       // Call updateProduct AFTER the INSERT completes
  //       updateProduct();
  //     }
  //   );
  
  //   // logs the actual query being run
  //   console.log(query.sql);
  //   }
  // function updateProduct() {
  //   console.log("Updating all Rocky Road quantities...\n");
  //   var query = connection.query(
  //     "UPDATE products SET ? WHERE ?",
  //     [
  //       {
  //         quantity: 100
  //       },
  //       {
  //         flavor: "Rocky Road"
  //       }
  //     ],
  //     function(err, res) {
  //       if (err) throw err;
  //       console.log(res.affectedRows + " products updated!\n");
  //       // Call deleteProduct AFTER the UPDATE completes
  //       deleteProduct();
  //     }
  //   );
  
  //   // logs the actual query being run
  //   console.log(query.sql);
  // }
  
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

  //Constructor function to get product info to display for user
  function Product(id, product, price) {
    this.item_id = id;
    this.product_name = product;
    this.price = price;
  }
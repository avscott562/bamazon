require("dotenv").config();
let inquirer = require("inquirer");
let mysql = require("mysql");

console.log(process.env.DB_USER);

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
      // Log all results of the SELECT statement
      console.log(res);
      console.log(res.length);
      purchase();
    });
}

// The app should then prompt users with two messages.

function purchase() {
  // The first should ask them the ID of the product they would like to buy.
  inquirer
    .prompt({
      name: "Item_id",
      type: "input",
      message: "What is the item id of the product you would like to purchase?"
    })
    .then(function(answer) {
      console.log(answer.Item_id);
    });
    connection.end();
}

// The second message should ask how many units of the product they would like to buy.



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

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

//establish connection to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");

  //run display function to see available products on screen.
  display();
});


// displays all of the items available for sale.
function display() {
  connection.query("SELECT * FROM products ORDER BY item_id", function(err, res) {
    if (err) throw err;

    //display all of the items available for sale.
    for (i=0; i<res.length; i++) {

      //checks if quantity is available for sale and add to inventory if any in stock.
      if (res[i].stock_quantity > 0) {

        // grab the ids, names, and prices of products for sale.
        let product = new Product(res[i].item_id, res[i].product_name, res[i].price);
        inventory.push(product);
      }
    }
    
    //checks if any items are available for sale and displays them if they are.
    if (inventory.length > 0) {
      console.log("Available products listed below.\n");
      for(a=0; a<inventory.length; a++) {
        console.log("Item ID: " + inventory[a].item_id + "\nProduct Name: " + inventory[a].product_name + "\nPrice: $" + (inventory[a].price).toFixed(2) + "\n\n");
      }
      // console.log(inventory);
    } else {
      //if no items available for sale, end connection to database
      console.log("Sorry, we are out of stock on all items.  Please try again later.");
      connection.end();
    }

    // run purchase function to get product and quatity from customer.
    purchase();
  });
}

//get the product and quantity of product the customer would like to purchase
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
          validItemIds.push(parseFloat(res[c].item_id));
        }

        // check to see if the item id provided is valid
        let inList = validItemIds.indexOf(parseFloat(answer.Item_id));
        
        //if it is a valid item id, ask user for quantity to purchase
        if(inList !== -1) {
          for (i=0; i<res.length; i++) {
            if(res[i].item_id == answer.Item_id) {
              let selectedItem = res[i];
              let stock = parseFloat(selectedItem.stock_quantity);
              if (stock > 0) {
                // if there is at least 1 in stock, ask the user how many they want to purchase
                inquirer
                .prompt({
                  name: "quantity",
                  type: "number",
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
                  let units = parseFloat(answer.quantity);
                  // check to see if there is sufficent quantity to meet the customer's request.
                  if (stock >= units) {
                    console.log("Yay!  We have enough in stock to fulfill your order.");

                    // However, if your store does have enough of the product, you should fulfill the customer's order.
                    // This means updating the SQL database to reflect the remaining quantity.
                    updateQuantity(stock, units, selectedItem.item_id, selectedItem.price, selectedItem.product_sales);
                  } else {

                    // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
                    console.log("Sorry, we do not have enough to fulfilll your order.");
                    connection.end();
                  }
                })
              } else {
                console.log(selectedItem.product_name + " is out of stock.");
                connection.end();
              }
              
            }
          }
        } else {
          console.log("Please select a valid Item ID.\n");
          purchase();
        }
      });
  })
}


// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
function updateQuantity(total, amount, itemNumber, price, totalSales) {
  let sales = parseFloat((price * amount).toFixed(2));
  console.log("\nUpdating product stock quantities...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: total - amount,
        product_sales: totalSales + sales
      },
      {
        item_id: itemNumber
      }
    ],
    function(err, res) {
      if (err) throw err;
      // console.log(res.affectedRows + " products updated!\n");

      // Once the update goes through, show the customer the total cost of their purchase.
      console.log("Your total is $" + sales + ".");
      connection.end();
    }
  );

  // logs the actual query being run
  // console.log(query.sql);
}
  

  
  //Constructor function to get product info to display for user
function Product(id, product, price) {
  this.item_id = id;
  this.product_name = product;
  this.price = price;
}
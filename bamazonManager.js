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

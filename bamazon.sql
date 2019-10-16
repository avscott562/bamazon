-- Instructions

-- Drops the bamazon if it exists currently --
-- DROP DATABASE IF EXISTS bamazon;

-- Create a MySQL Database called bamazon.
CREATE DATABASE bamazon;

-- Make it so all of the following code will affect bamazon --

USE bamazon;
-- Then create a Table inside of that database called products.
CREATE TABLE products (
 -- The products table should have each of the following columns:
    -- item_id (unique id for each product)
    -- product_name (Name of product)
    -- department_name
    -- price (cost to customer)
    -- stock_quantity (how much of the product is available in stores)
    -- PRIMARY_KEY(item_id);
);



-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
-- ### Alternative way to insert more than one row
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("", "", 10.30, 100), ("", "", 10.30, 100), ("", "", 10.30, 100);

SELECT * FROM products
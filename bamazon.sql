-- Instructions

-- Drops the bamazon database if it exists currently --
DROP DATABASE IF EXISTS bamazon;

-- Create a MySQL Database called bamazon.
CREATE DATABASE bamazon;

-- Make it so all of the following code will affect bamazon --

USE bamazon;
-- Then create a Table inside of that database called products.
CREATE TABLE products (
 -- The products table should have each of the following columns:
    -- item_id (unique id for each product)
    item_id INT AUTO_INCREMENT NOT NULL,
    -- product_name (Name of product)
    product_name VARCHAR(50) NULL,
    -- department_name
    department_name VARCHAR(50) NULL,
    -- price (cost to customer)
    price DECIMAL(5,2) NULL,
    -- stock_quantity (how much of the product is available in stores)
    stock_quantity INTEGER NULL,
    -- PRIMARY_KEY(item_id);
    PRIMARY KEY(item_id)
);



-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
-- ### Alternative way to insert more than one row
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bluetooth Speaker", "Electronics", 100.99, 100), ("Ballpoint Pens (2 pk)", "Office", 1.20, 100), ("Ink Cartridges (black)", "Office", 64.89, 100), ("Ink Cartridges (color)", "Office", 74.50, 100), ("Sweater", "Apparel & Accessories", 23.50, 100), ("Jeans", "Apparel & Accessories", 35.00, 100), ("Handbag", "Apparel & Accessories", 225.00, 100), ("Tennis Shoes", "Apparel & Accessories", 125.44, 100), ("Eyeshadow Palette", "Health & Beauty", 29.99, 100), ("Lipstick", "Health & Beauty", 16.99, 100);

-- SELECT * FROM products
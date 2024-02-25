USE restaurant_review;

CREATE TABLE user (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  address VARCHAR(100) NOT NULL,
  password VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  email VARCHAR(80) NOT NULL,
  acc_created_date DATETIME NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE cuisine (
  cuisine_id INT NOT NULL AUTO_INCREMENT,
  cuisine_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (cuisine_id)
);

CREATE TABLE address (
  address_id INT NOT NULL AUTO_INCREMENT,
  address VARCHAR(45) NOT NULL,
  postal_code VARCHAR(45) NOT NULL,
  PRIMARY KEY (address_id)
);

CREATE TABLE restaurant (
  restaurant_id INT NOT NULL AUTO_INCREMENT,
  restaurant_name VARCHAR(60) NOT NULL,
  restaurant_synopsis TEXT(1024) NOT NULL,
  price INT NOT NULL,
  image_url VARCHAR(200) NOT NULL,
  meal_time_type VARCHAR(45) NOT NULL,
  opening_hours VARCHAR(45) NOT NULL,
  contact VARCHAR(45) NOT NULL,
  PRIMARY KEY(restaurant_id)
);

CREATE TABLE located_in (
    restaurant_id INT,
    address_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id),
    FOREIGN KEY (address_id) REFERENCES address(address_id),
    PRIMARY KEY (restaurant_id, address_id)
);

CREATE TABLE serve (
    restaurant_id INT,
    cuisine_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id),
    FOREIGN KEY (cuisine_id) REFERENCES cuisine(cuisine_id),
    PRIMARY KEY (restaurant_id, cuisine_id)
);

CREATE TABLE review (
  last_updated DATETIME NOT NULL,
  review_rating DECIMAL NOT NULL,
  review TEXT(1024) NULL,
  user_id INT,
  restaurant_id INT,
  FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  PRIMARY KEY (restaurant_id, user_id)
);

INSERT INTO user (username, email, mobile_number, first_name, last_name, password, acc_created_date, gender, address) VALUES ('alex', 'alex@gmail.com', '98276376', 'Alex', 'Tan', '123456', '2021-02-02 11:21:07', 'Male', '123 Jurong'), ('lina', 'lina@gmail.com', '98276376', 'Lina', 'Tan', '123456', '2021-02-02 11:21:07', 'Female', '456 Pasir Ris');
INSERT INTO restaurant (restaurant_name, restaurant_synopsis, price, image_url, meal_time_type, opening_hours, contact) VALUES 
('Pasta Express', 'Sells pasta', 123, 'pasta_express.png', 'Afternoon', '12-9pm', '93876356'), 
('Chinese Express', 'Sells chinese food', 22, 'chinese_express.png', 'Afternoon', '12-9pm', '93876456'),
('Sushi go', 'Sells sushi', 20, 'sushigo.png', 'Afternoon', '12-9pm', '93876312'), 
('Haidilao', 'Sells noodles', 100, 'haidilao.png', 'Afternoon', '12-9pm', '93876126'),
('Din tai fung', 'Sells steamed buns', 123, 'dintaifung.png', 'Afternoon', '12-9pm', '93871234'), 
('Swensens', 'Sells western food', 25, 'swensens.png', 'Afternoon', '12-9pm', '91236456'),
('Thai kitchen', 'Sells thai food', 60, 'thaikitchen.png', 'Afternoon', '12-9pm', '93875432'), 
('Pizza hut', 'Sells pizza', 123, 'pizzahut.png', 'Afternoon', '12-9pm', '93345556'),
('Mcdonalds', 'Sells fast food', 56, 'mcdonalds.png', 'Afternoon', '12-9pm', '93823456'), 
('Pepper lunch', 'Sells chinese food', 13, 'pepperlunch.png', 'Afternoon', '12-9pm', '93823456');
INSERT INTO review (review, review_rating, user_id, restaurant_id, last_updated) VALUES ('Good', 5, 1, 1, '2021-02-02 11:21:07'), ('Delicious food', 4, 2, 2, '2021-02-02 11:21:07');
INSERT INTO address (address, postal_code) VALUES 
('123 road #11-11', '123456'), 
('456 road #22-11', '456789'), 
('34 road #2-11', '123456'), 
('486 road #22-21', '987456'), 
('578 road #06-11', '234876'), 
('542 road #04-11', '234875');
INSERT INTO located_in (restaurant_id, address_id) VALUES (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 1), (8, 2), (9, 3), (10, 4);
INSERT INTO cuisine (cuisine_name) VALUES ('Western'), ('Chinese'), ('Halal'), ('Non-Halal'), ('Japanese'), ('Thai'), ('Fastfood');
INSERT INTO serve (restaurant_id, cuisine_id) VALUES (1, 1), (1, 4), (2, 2), (2, 3), (3, 5), (4, 2), (5, 2), (6, 1), (7, 6), (8, 1), (9, 7), (10, 2);
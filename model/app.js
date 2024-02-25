const pool = require("../database/config");

var model = {};

// User

model.getAllUsers = function (callback) {
  const sql = `SELECT * FROM user`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

model.getUser = function (user_id, callback) {
  const sql = `SELECT * FROM user WHERE user_id = ?`;
  pool.query(sql, [user_id], (err, rows) => {
    callback(err, rows);
  });
};

model.getUserByEmail = function (email, callback) {
  const sql = `SELECT * FROM user WHERE email = ?`;
  pool.query(sql, [email], (err, rows) => {
    callback(err, rows);
  });
};

model.getUserByEmailAndPassword = function (email, password, callback) {
  const sql = `SELECT * FROM user WHERE email = ? AND password = ?`;
  pool.query(sql, [email, password], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoUser = function (
  username,
  first_name,
  last_name,
  gender,
  mobile_number,
  address,
  password,
  email,
  acc_created_date,
  callback
) {
  const sql = `INSERT INTO user (username, first_name, last_name, gender, mobile_number, address, password, email, acc_created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  pool.query(
    sql,
    [
      username,
      first_name,
      last_name,
      gender,
      mobile_number,
      address,
      password,
      email,
      acc_created_date,
    ],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

model.updateUser = function (
  username,
  first_name,
  last_name,
  gender,
  mobile_number,
  address,
  password,
  email,
  acc_created_date,
  user_id,
  callback
) {
  const sql = `UPDATE user SET username = ?, first_name = ?, last_name = ?, gender = ? , mobile_number = ?, address = ?, password = ?, email = ?, acc_created_date = ? WHERE user_id = ?`;
  pool.query(
    sql,
    [
      username,
      first_name,
      last_name,
      gender,
      mobile_number,
      address,
      password,
      email,
      acc_created_date,
      user_id,
    ],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

model.deleteUser = function (user_id, callback) {
  const sql = `DELETE FROM user WHERE user_id = ?`;
  pool.query(sql, [user_id], (err, rows) => {
    callback(err, rows);
  });
};

// Cuisine

model.getAllCuisines = function (callback) {
  const sql = `SELECT * FROM cuisine`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

model.getCuisine = function (cuisine_id, callback) {
  const sql = `SELECT * FROM cuisine WHERE cuisine_id = ?`;
  pool.query(sql, [cuisine_id], (err, rows) => {
    callback(err, rows);
  });
};

model.getCuisinesByRestaurant = function (restaurant_id, callback) {
  const sql = `SELECT * FROM cuisine NATURAL JOIN serve WHERE restaurant_id = ?`;
  pool.query(sql, [restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoCuisine = function (cuisine_name, callback) {
  const sql = `INSERT INTO cuisine (cuisine_name) VALUES (?)`;
  pool.query(sql, [cuisine_name], (err, rows) => {
    callback(err, rows);
  });
};

model.updateCuisine = function (cuisine_name, cuisine_id, callback) {
  const sql = `UPDATE cuisine SET cuisine_name = ? WHERE cuisine_id = ?`;
  pool.query(sql, [cuisine_name, cuisine_id], (err, rows) => {
    callback(err, rows);
  });
};

model.deleteCuisine = function (cuisine_id, callback) {
  const sql = `DELETE FROM cuisine WHERE cuisine_id = ?`;
  pool.query(sql, [cuisine_id], (err, rows) => {
    callback(err, rows);
  });
};

// Address

model.getAllAddresses = function (callback) {
  const sql = `SELECT * FROM address`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

model.getAddress = function (address_id, callback) {
  const sql = `SELECT * FROM address WHERE address_id = ?`;
  pool.query(sql, [address_id], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoAddress = function (address, postal_code, callback) {
  const sql = `INSERT INTO address (address, postal_code) VALUES (?, ?)`;
  pool.query(sql, [address, postal_code], (err, rows) => {
    callback(err, rows);
  });
};

model.updateAddress = function (address, postal_code, address_id, callback) {
  const sql = `UPDATE address SET address = ?, postal_code= ? WHERE address_id = ?`;
  pool.query(sql, [address, postal_code, address_id], (err, rows) => {
    callback(err, rows);
  });
};

model.deleteAddress = function (address_id, callback) {
  const sql = `DELETE FROM address WHERE address_id = ?`;
  pool.query(sql, [address_id], (err, rows) => {
    callback(err, rows);
  });
};

// Located in

model.getLocatedInForRestaurant = function (restaurant_id, callback) {
  const sql = `SELECT * FROM located_in WHERE restaurant_id = ?`;
  pool.query(sql, [restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoLocatedIn = function (address_id, restaurant_id, callback) {
  const sql = `INSERT INTO located_in (address_id, restaurant_id) VALUES (?, ?)`;
  pool.query(sql, [address_id, restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.deleteLocatedIn = function (address_id, restaurant_id, callback) {
  const sql = `DELETE FROM located_in WHERE address_id = ? AND restaurant_id = ?`;
  pool.query(sql, [address_id, restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

// Serves

model.getServeForRestaurant = function (restaurant_id, callback) {
  const sql = `SELECT * FROM serve WHERE restaurant_id = ?`;
  pool.query(sql, [restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoServe = function (cuisine_id, restaurant_id, callback) {
  const sql = `INSERT INTO serve (cuisine_id, restaurant_id) VALUES (?, ?)`;
  pool.query(sql, [cuisine_id, restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.deleteServe = function (cuisine_id, restaurant_id, callback) {
  const sql = `DELETE FROM serve WHERE cuisine_id = ? AND restaurant_id = ?`;
  pool.query(sql, [cuisine_id, restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

// Restaurant

model.getAllRestaurants = function (callback) {
  const sql = `SELECT * FROM restaurant`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

model.getRestaurant = function (restaurant_id, callback) {
  const sql = `SELECT R.restaurant_id AS restaurant_id, restaurant_name, restaurant_synopsis, price, meal_time_type, opening_hours, image_url, contact, address, postal_code 
        FROM (address A NATURAL JOIN located_in L) RIGHT OUTER JOIN restaurant R ON R.restaurant_id = L.restaurant_id 
        WHERE R.restaurant_id = ?`;
  pool.query(sql, [restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.getRestaurantsByName = function (name, callback) {
  const sql = `SELECT * FROM restaurant WHERE restaurant_name LIKE ?`;
  pool.query(sql, [`%${name}%`], (err, rows) => {
    callback(err, rows);
  });
};

model.getRestaurantsByCuisine = function (cuisine_id, callback) {
  const sql = `SELECT * FROM restaurant R WHERE EXISTS(SELECT 1 FROM serve S WHERE S.cuisine_id = ? AND S.restaurant_id = R.restaurant_id)`;
  pool.query(sql, [cuisine_id], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoRestaurant = function (
  restaurant_name,
  restaurant_synopsis,
  price,
  image_url,
  meal_time_type,
  opening_hours,
  contact,
  callback
) {
  const sql = `INSERT INTO restaurant (restaurant_name, restaurant_synopsis, price, image_url, meal_time_type, opening_hours, contact) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  pool.query(
    sql,
    [
      restaurant_name,
      restaurant_synopsis,
      price,
      image_url,
      meal_time_type,
      opening_hours,
      contact,
    ],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

model.updateRestaurant = function (
  restaurant_name,
  restaurant_synopsis,
  price,
  image_url,
  meal_time_type,
  opening_hours,
  contact,
  restaurant_id,
  callback
) {
  const sql = `UPDATE restaurant SET restaurant_name = ?, restaurant_synopsis = ?, price = ?, image_url = ?, meal_time_type = ?, opening_hours = ?, contact = ? WHERE restaurant_id = ?`;
  pool.query(
    sql,
    [
      restaurant_name,
      restaurant_synopsis,
      price,
      image_url,
      meal_time_type,
      opening_hours,
      contact,
      restaurant_id,
    ],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

model.deleteRestaurant = function (restaurant_id, callback) {
  const sql = `DELETE FROM restaurant WHERE restaurant_id = ?`;
  pool.query(sql, [restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

// Review

model.getAllReviews = function (callback) {
  const sql = `SELECT * FROM review`;
  pool.query(sql, (err, rows) => {
    callback(err, rows);
  });
};

model.getReviewsForRestaurant = function (restaurant_id, callback) {
  const sql = `SELECT * FROM review R NATURAL JOIN user U WHERE restaurant_id = ?`;
  pool.query(sql, [restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.getReview = function (restaurant_id, user_id, callback) {
  const sql = `SELECT * FROM review WHERE restaurant_id = ? AND user_id = ?`;
  pool.query(sql, [restaurant_id, user_id], (err, rows) => {
    callback(err, rows);
  });
};

model.getReviewForUser = function (user_id, callback) {
  const sql = `SELECT * FROM review WHERE user_id = ?`;
  pool.query(sql, [user_id], (err, rows) => {
    callback(err, rows);
  });
};

model.insertIntoReview = function (
  last_updated,
  review_rating,
  review,
  user_id,
  restaurant_id,
  callback
) {
  const sql = `INSERT INTO review (last_updated, review_rating, review, user_id, restaurant_id) VALUES (?, ?, ?, ?, ?)`;
  pool.query(
    sql,
    [last_updated, review_rating, review, user_id, restaurant_id],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

model.updateReview = function (
  last_updated,
  review_rating,
  review,
  user_id,
  restaurant_id,
  callback
) {
  const sql = `UPDATE review SET last_updated = ?, review_rating = ?, review = ? WHERE user_id = ? AND restaurant_id = ?`;
  pool.query(
    sql,
    [last_updated, review_rating, review, user_id, restaurant_id],
    (err, rows) => {
      callback(err, rows);
    }
  );
};

model.deleteReview = function (restaurant_id, user_id, callback) {
  const sql = `DELETE FROM review WHERE user_id = ? AND restaurant_id = ?`;
  pool.query(sql, [user_id, restaurant_id], (err, rows) => {
    callback(err, rows);
  });
};

model.deleteReviewsByUser = function (user_id, callback) {
  const sql = `DELETE FROM review WHERE user_id = ?`;
  pool.query(sql, [user_id], (err, rows) => {
    callback(err, rows);
  });
};

module.exports = model;

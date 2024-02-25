var mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: "",
  user: "root",
  database: "restaurant_review",
  host: "localhost",
});

module.exports = pool;

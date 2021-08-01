const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "learn-node",
  password: "Khanh#123",
});

module.exports = pool.promise();

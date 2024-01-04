const dotenv = require("dotenv");
dotenv.config();

const mariadb = require("mysql2");
const conn = mariadb.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Bookshop",
  dateStrings: true,
});
module.exports = conn;

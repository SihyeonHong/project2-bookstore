import dotenv from "dotenv";
dotenv.config();

import mariadb from "mysql2";
export const conn = mariadb.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Bookshop",
  dateStrings: true,
});

import mariadb from "mysql2/promise";
import dotenv from "dotenv";
const env = dotenv.config().parsed;

export const pool = mariadb.createPool({
  port: env.DB_PORT,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: "Bookshop",
  dateStrings: true,
  connectionLimit: 5,
});

// todo : 리팩토링 후 아래 삭제
import mariadb2 from "mysql2";

export const conn = mariadb2.createConnection({
  port: env.DB_PORT,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: "Bookshop",
  dateStrings: true,
});

import mariadb from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export default class Database {
  constructor() {
    this.pool = mariadb.createPool({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "Bookshop",
      dateStrings: true,
      connectionLimit: 5,
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getPool() {
    return this.pool;
  }

  static async runQuery(sql, params = []) {
    const instance = Database.getInstance();
    const pool = instance.getPool();

    try {
      return await pool.query(sql, params);
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

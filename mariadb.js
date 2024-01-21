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

  static async runQuery(sql, params = []) {
    let conn;
    try {
      const instance = Database.getInstance();
      conn = await instance.pool.getConnection();
      const [results] = await conn.query(sql, params);
      return results;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}

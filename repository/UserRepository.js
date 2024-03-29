import Database from "./../mariadb.js";
import crypto from "crypto";

export default class UserRepository {
  async insertNewUser(email, password) {
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const values = [email, hashPassword, salt];

    return await Database.runQuery(sql, values);
  }

  async findID(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    return await Database.runQuery(sql, [email]);
  }

  async updatePW(email, password) {
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");
    const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
    const values = [hashPassword, salt, email];
    return await Database.runQuery(sql, values);
  }
}

import Database from "./../mariadb.js";

export default class CategoryRepository {
  async getCategories() {
    const sql = "SELECT category FROM books";
    const [rows] = await Database.runQuery(sql, []);
    return rows;
  }
}

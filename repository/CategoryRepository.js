import Database from "./../mariadb.js";

export default class CategoryRepository {
  async getCategories() {
    const sql = "SELECT category FROM books";
    return await Database.runQuery(sql, values);
  }
}

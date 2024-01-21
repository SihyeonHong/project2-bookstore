import Database from "./../mariadb.js";

export default class CartRepository {
  async getCart(email, checked) {
    const checkedSQL = checked && checked.length ? ` AND id IN (?)` : ``;
    const sql = `SELECT id, book_id, quantity, title, price, summary 
          FROM cartItems 
          LEFT JOIN books ON cartItems.book_id = books.isbn
          WHERE user_id = ?${checkedSQL}`;
    const values = [email, checked];
    return await Database.runQuery(sql, values);
  }

  async addToCart(email, isbn, quantity) {
    const [checked] = await this.checkedCartItemExist(email, isbn);
    return checked
      ? await this.updateCartItemQuantity(
          checked.id,
          checked.quantity,
          quantity
        )
      : await this.insertNewCartItem(email, isbn, quantity);
  }

  async deleteCartItem(id) {
    const sql = `DELETE FROM cartItems WHERE id = ?`;
    const values = [id];
    return await Database.runQuery(sql, values);
  }

  async checkedCartItemExist(email, isbn) {
    const sql = "SELECT * FROM cartItems WHERE user_id = ? AND book_id = ?";
    const values = [email, isbn];
    return await Database.runQuery(sql, values);
  }

  async updateCartItemQuantity(id, oldQuantity, newQuantity) {
    const sql = "UPDATE cartItems SET quantity = ? WHERE id = ?";
    const values = [oldQuantity + newQuantity, id];
    return await Database.runQuery(sql, values);
  }

  async insertNewCartItem(email, isbn, quantity) {
    const sql =
      "INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)";
    const values = [email, isbn, quantity];
    return await Database.runQuery(sql, values);
  }
}

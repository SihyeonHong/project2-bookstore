import Database from "./../mariadb.js";
import CartRepository from "./CartRepository.js";

const cartRepo = new CartRepository();

export default class OrderRepository {
  async submitOrder(email, items, delivery, totalQuantity, totalPrice) {
    const cartItems = await cartRepo.getCart(email, items);
    if (cartItems.length === 0) {
      return;
    }
    const deliveryResult = await this.addDelivery(delivery);
    const orderResult = await this.addOrder(
      cartItems[0].title,
      totalQuantity,
      totalPrice,
      email,
      deliveryResult.insertId
    );
    const orderedItemsResult = await this.addOrderedItems(
      orderResult.insertId,
      cartItems
    );
    const deleteCartResult = orderedItemsResult.affectedRows
      ? await this.deleteCartItem(items)
      : null;
    return deleteCartResult;
  }

  async getOrder(email) {
    const sql = `SELECT orders.id, main_title, total_quantity, total_price, created_at, address, receiver, contact
    FROM orders
    LEFT JOIN deliveries ON orders.delivery_id = deliveries.id
    WHERE user_id = ?`;
    const values = [email];
    return await Database.runQuery(sql, values);
  }

  async getOrderDetail(orderId) {
    const sql = `SELECT book_id, title, author, price, quantity
    FROM orderedItems
    LEFT JOIN books ON orderedItems.book_id = books.isbn
    WHERE order_id = ?`;
    const values = [orderId];
    return await Database.runQuery(sql, values);
  }

  async addDelivery(delivery) {
    const sql = `INSERT INTO deliveries (address, receiver, contact) VALUES (?,?,?)`;
    const values = [delivery.address, delivery.receiver, delivery.contact];
    return await Database.runQuery(sql, values);
  }

  async addOrder(bookTitle, totalQuantity, totalPrice, email, deliveryId) {
    const sql = `INSERT INTO orders (main_title, total_quantity, total_price, user_id, delivery_id) 
    VALUES (?,?,?,?,?)`;
    const values = [bookTitle, totalQuantity, totalPrice, email, deliveryId];
    return await Database.runQuery(sql, values);
  }

  async addOrderedItems(orderId, cartItems) {
    const sql = `INSERT INTO orderedItems (order_id, book_id, quantity) VALUES ?`;
    let values = [];
    cartItems.forEach((item) => {
      values.push([orderId, item.book_id, item.quantity]);
    });
    return await Database.runQuery(sql, values);
  }

  async deleteCartItem(items) {
    const sql = `DELETE FROM cartItems WHERE id IN (?)`;
    return await Database.runQuery(sql, items);
  }
}

import Database from "./../mariadb.js";

export default class OrderRepository {
  async submitOrder(email, items, delivery, totalQuantity, totalPrice) {
    const deliveryResult = await this.addDelivery(delivery);
    const orderResult = await this.addOrder(
      items[0].title,
      totalQuantity,
      totalPrice,
      email,
      deliveryResult.insertId
    );
    const orderedItems = await this.addOrderedItems(
      orderResult.insertId,
      items
    );
    return orderedItems;
  }

  async addDelivery(delivery) {
    const sql = `INSERT INTO deliveries (address, receiver, contact) VALUES (?,?,?)`;
    const values = [delivery.address, delivery.receiver, delivery.contact];
    const [rows] = await Database.runQuery(sql, values);
    return rows;
  }

  async addOrder(bookTitle, totalQuantity, totalPrice, email, deliveryId) {
    const sql = `INSERT INTO orders (main_title, total_quantity, total_price, user_id, delivery_id) 
    VALUES (?,?,?,?,?)`;
    const values = [bookTitle, totalQuantity, totalPrice, email, deliveryId];
    const [rows] = await Database.runQuery(sql, values);
    return rows;
  }

  async addOrderedItems(orderId, items) {
    const sql = `INSERT INTO orderedItems (order_id, book_id, quantity) VALUES ?`;
    let values = [];
    items.forEach((item) => {
      values.push([orderId, item.isbn, item.quantity]);
    });
    const [rows] = await Database.runQuery(sql, [values]);
    return rows;
  }
}

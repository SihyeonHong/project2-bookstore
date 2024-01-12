import Database from "./../mariadb.js";

export default class BookRepository {
  async getBooks(email, limit, currentPage, category, recent) {
    let sql = `SELECT *, 
        (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes, 
        (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked 
        FROM books`;
    let values = [email];

    // options
    if (category && recent) {
      sql +=
        " WHERE category = ? AND published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
      values.push(category);
    } else if (category) {
      sql += " WHERE category = ?";
      values.push(category);
    } else if (recent) {
      sql +=
        " WHERE published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    // paging
    const offset = parseInt(limit) * parseInt(currentPage - 1);
    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);

    // query
    const [rows] = await Database.runQuery(sql, values);
    return rows;
  }

  async getBookDetail(email, isbn) {
    const sql = `SELECT *, 
    (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes, 
    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked 
    FROM books 
    WHERE isbn = ?`;
    const values = [email, isbn];
    const [rows] = await Database.runQuery(sql, values);
    return rows;
  }
}

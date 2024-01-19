import Database from "./../mariadb.js";

export default class BookRepository {
  async getBooks(email, limit, currentPage, category, recent) {
    const sqlForEmail = email
      ? `, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked `
      : ``;
    const sqlForOptions = this.setSQLForOptions(category, recent);
    const offset = parseInt(limit) * parseInt(currentPage - 1);

    const sql = `SELECT books.*, 
        (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes 
        ${sqlForEmail} FROM books ${sqlForOptions} LIMIT ? OFFSET ?`;
    let values = [email, category, parseInt(limit), offset].filter(
      (el) => el !== null && el !== undefined
    );

    const books = await Database.runQuery(sql, values);
    const totalCount = await this.getBooksCount(email);
    return {
      pagination: {
        totalCount: totalCount,
        currentPage: parseInt(currentPage),
      },
      books: books,
    };
  }
  setSQLForOptions(category, recent) {
    if (category && recent) {
      return "WHERE category = ? AND published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    } else if (category) {
      return "WHERE category = ?";
    } else if (recent) {
      return "WHERE published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    } else {
      return "";
    }
  }

  async getBooksCount() {
    const sql = `SELECT COUNT(*) FROM books`;
    const [rows] = await Database.runQuery(sql, []);
    return rows["COUNT(*)"];
  }

  async getBookDetail(email, isbn) {
    const sqlForEmail = email
      ? `, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked `
      : ``;
    const sql = `SELECT *, 
    (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes
    ${sqlForEmail}
    FROM books 
    WHERE isbn = ?`;
    const values = [email, isbn].filter((el) => el);

    return await Database.runQuery(sql, values);
  }
}

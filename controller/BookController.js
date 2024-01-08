import { StatusCodes } from "http-status-codes";
import { conn } from "./../mariadb.js";

export const allBooks = (req, res) => {
  const { limit, currentPage, category, recent } = req.query;
  const { user_id } = req.body;
  let sql =
    "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked FROM books";
  let values = [user_id];

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
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

export const booksDetail = (req, res) => {
  const { isbn } = req.params;
  const { user_id } = req.body;
  const sql =
    "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked FROM books WHERE isbn = ?";
  const values = [user_id, isbn];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

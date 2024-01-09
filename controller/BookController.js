import { StatusCodes } from "http-status-codes";
import Database from "./../mariadb.js";

export const allBooks = async (req, res) => {
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
  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    return rows[0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const booksDetail = async (req, res) => {
  const { isbn } = req.params;
  const { user_id } = req.body;
  const sql =
    "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book = books.isbn) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book = books.isbn)) AS liked FROM books WHERE isbn = ?";
  const values = [user_id, isbn];

  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    return rows[0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

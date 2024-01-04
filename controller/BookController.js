const conn = require("./../mariadb");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
  const { limit, currentPage, category, recent } = req.query;
  let sql = "SELECT * FROM books";
  let values = [];

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

const booksDetail = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM books WHERE id = ?";
  conn.query(sql, id, (err, results) => {
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

module.exports = { allBooks, booksDetail };

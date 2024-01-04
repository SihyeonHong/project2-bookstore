const conn = require("./../mariadb");
const { StatusCodes } = require("http-status-codes");

const categories = (req, res) => {
  const sql = "SELECT category FROM books";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      let categoryList = results.map((el) => el.category);
      const categorySet = new Set(categoryList);
      categoryList = [...categorySet];
      return res.status(StatusCodes.OK).json(categoryList);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = categories;

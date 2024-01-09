import { StatusCodes } from "http-status-codes";
import Database from "./../mariadb.js";

export const categories = async (req, res) => {
  const sql = "SELECT category FROM books";

  try {
    const [rows, fields] = await Database.runQuery(sql, []);
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    let categoryList = rows.map((el) => el.category);
    const categorySet = new Set(categoryList);
    categoryList = [...categorySet];
    return res.status(StatusCodes.OK).json(categoryList);
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

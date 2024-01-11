import { StatusCodes } from "http-status-codes";
import Database from "./../mariadb.js";

export const getCart = async (req, res) => {
  const { email, checked } = req.body;

  const checkedSQL = checked && checked.length ? ` AND id IN (?)` : ``;
  const sql = `SELECT id, book_id, quantity, title, price, summary 
    FROM cartItems 
    LEFT JOIN books ON cartItems.book_id = books.isbn
    WHERE user_id = ?${checkedSQL}`;
  const values = [email, checked];

  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    return rows[0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { email, isbn, quantity } = req.body;

  const selectSQL = "SELECT * FROM cartItems WHERE user_id = ? AND book_id = ?";
  const selectVals = [email, isbn];
  try {
    let [selected, cartFields] = await Database.runQuery(selectSQL, selectVals);

    let sql = "";
    let values = [];
    if (selected.length) {
      sql = "UPDATE cartItems SET quantity = ? WHERE id = ?";
      values = [selected[0].quantity + quantity, selected[0].id];
    } else {
      sql =
        "INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)";
      values = [email, isbn, quantity];
    }
    let [rows, fields] = await Database.runQuery(sql, values);
    const status =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(status).end();
  } catch (err) {
    console.log(err.code);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM cartItems WHERE id = ?`;
  const values = [id];
  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    const statusCode =
      rows && rows.affectedRows ? StatusCodes.OK : StatusCodes.NOT_FOUND;
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

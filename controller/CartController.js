import { StatusCodes } from "http-status-codes";
import Database from "./../mariadb.js";

export const getCart = async (req, res) => {
  const { email } = req.body;

  res.json({ message: "getCart" });
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
  res.json({ message: "deleteCartItem" });
};

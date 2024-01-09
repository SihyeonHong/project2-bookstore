import { StatusCodes } from "http-status-codes";
import Database from "./../mariadb.js";

export const addLike = async (req, res) => {
  const { liked_book } = req.params;
  const { user_id } = req.body;

  const sql = "INSERT INTO likes (user_id, liked_book) VALUES (?, ?)";
  const values = [user_id, liked_book];

  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    const status =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(status).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const deleteLike = async (req, res) => {
  const { liked_book } = req.params;
  const { user_id } = req.body;

  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book = ?";
  const values = [user_id, liked_book];

  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    const status =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.NOT_FOUND;
    return res.status(status).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

import { StatusCodes } from "http-status-codes";
import { pool } from "./../mariadb.js";

export const addLike = async (req, res) => {
  const { liked_book } = req.params;
  const { user_id } = req.body;

  const sql = "INSERT INTO likes (user_id, liked_book) VALUES (?, ?)";
  const values = [user_id, liked_book];

  try {
    const [results] = await pool.query(sql, values);
    return res.status(StatusCodes.CREATED).json(results);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const deleteLike = async (req, res) => {
  const { liked_book } = req.params;
  const { user_id } = req.body;

  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book = ?";
  const values = [user_id, liked_book];

  try {
    const [results] = await pool.query(sql, values);
    return results.affectedRows === 0
      ? res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "No rows affected. No like found for given data." })
      : res
          .status(StatusCodes.OK)
          .json({ message: "Like successfully deleted." });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

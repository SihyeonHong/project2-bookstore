import { StatusCodes } from "http-status-codes";
import LikeRepository from "../repository/LikeRepository.js";
import { getUserId } from "../middleware/jwt.js";

const likeRepo = new LikeRepository();

export const addLike = async (req, res) => {
  try {
    const { liked_book } = req.params;
    const user_id = getUserId(req.headers["authorization"]);
    const rows = await likeRepo.addLike(user_id, liked_book);
    const status =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(status).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { liked_book } = req.params;
    const user_id = getUserId(req.headers["authorization"]);

    const rows = await likeRepo.deleteLike(user_id, liked_book);
    const status =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.NOT_FOUND;
    return res.status(status).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

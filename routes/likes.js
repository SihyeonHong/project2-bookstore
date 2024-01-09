import express from "express";
import { addLike, deleteLike } from "./../controller/LikeController.js";
const likeRouter = express.Router();

likeRouter.use(express.json());

likeRouter.post("/:liked_book", addLike);
likeRouter.delete("/:liked_book", deleteLike);

export default likeRouter;

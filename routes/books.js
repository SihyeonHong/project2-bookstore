import express from "express";
import { allBooks, booksDetail } from "./../controller/BookController.js";

const bookRouter = express.Router();
// router.use(express.json());

bookRouter.get("/", allBooks);
bookRouter.get("/:id", booksDetail);

export default bookRouter;
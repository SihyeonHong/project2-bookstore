import express from "express";
import { allBooks, booksDetail } from "./../controller/BookController.js";

const bookRouter = express.Router();
bookRouter.use(express.json());

bookRouter.get("/", allBooks);
bookRouter.get("/:isbn", booksDetail);

export default bookRouter;

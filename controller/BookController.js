import { StatusCodes } from "http-status-codes";
import BookRepository from "../repository/BookRepository.js";
import { getUserId } from "../middleware/jwt.js";

const bookRepo = new BookRepository();

export const allBooks = async (req, res) => {
  try {
    const { limit, currentPage, category, recent } = req.query;
    const token = req.headers["authorization"];
    const email = token ? getUserId(isLoggedIn) : null;

    const rows = await bookRepo.getBooks(
      email,
      limit,
      currentPage,
      category,
      recent
    );
    return rows["books"][0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const booksDetail = async (req, res) => {
  try {
    const { isbn } = req.params;
    const email = getUserId(req.headers["authorization"]);

    const rows = await bookRepo.getBookDetail(email, isbn);
    return rows[0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

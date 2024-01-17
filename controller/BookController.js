import { StatusCodes } from "http-status-codes";
import BookRepository from "../repository/BookRepository.js";

const bookRepo = new BookRepository();

export const allBooks = async (req, res) => {
  try {
    const { limit, currentPage, category, recent } = req.query;
    const { email } = req.body;

    const rows = await bookRepo.getBooks(
      email,
      limit,
      currentPage,
      category,
      recent
    );
    return rows[0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const booksDetail = async (req, res) => {
  try {
    const { isbn } = req.params;
    const { email } = req.body;

    const rows = await bookRepo.getBookDetail(email, isbn);
    return rows[0]
      ? res.status(StatusCodes.OK).json(rows)
      : res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

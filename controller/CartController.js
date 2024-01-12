import { StatusCodes } from "http-status-codes";
import CartRepository from "../repository/CartRepository.js";

const cartRepo = new CartRepository();

export const getCart = async (req, res) => {
  const { email, checked } = req.body;
  try {
    const rows = await cartRepo.getCart(email, checked);
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
  try {
    const rows = await cartRepo.addToCart(email, isbn, quantity);
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
  try {
    const rows = await cartRepo.deleteCartItem(id);
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

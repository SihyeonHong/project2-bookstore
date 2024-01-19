import { StatusCodes } from "http-status-codes";
import OrderRepository from "./../repository/OrderRepository.js";
import { getUserId } from "../middleware/jwt.js";
import jwt from "jsonwebtoken";

const orderRepo = new OrderRepository();

export const submitOrder = async (req, res) => {
  try {
    const { items, delivery, totalQuantity, totalPrice } = req.body;
    const email = getUserId(req.headers["authorization"]);

    const rows = await orderRepo.submitOrder(
      email,
      items,
      delivery,
      totalQuantity,
      totalPrice
    );
    const status =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(status).end();
  } catch (err) {
    console.log(err);
    const statusCode =
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.JsonWebTokenError
        ? StatusCodes.UNAUTHORIZED
        : StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json(err);
  }
};

export const getOrders = async (req, res) => {
  try {
    const email = getUserId(req.headers["authorization"]);
    const rows = await orderRepo.getOrder(email);
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

export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const rows = await orderRepo.getOrderDetail(orderId);
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

import { StatusCodes } from "http-status-codes";
import OrderRepository from "./../repository/OrderRepository.js";

const orderRepo = new OrderRepository();

export const submitOrder = async (req, res) => {
  try {
    const { email, items, delivery, totalQuantity, totalPrice } = req.body;

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
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { email } = req.body;
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
  const { email } = req.body;
  res.json({ message: "주문 상세 상품 조회" });
};

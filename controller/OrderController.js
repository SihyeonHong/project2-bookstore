import { StatusCodes } from "http-status-codes";
import OrderRepository from "./../repository/OrderRepository.js";

const orderRepo = new OrderRepository();

export const submitOrder = async (req, res) => {
  const { email, items, delivery, totalQuantity, totalPrice } = req.body;
  try {
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

export const getOrders = (req, res) => {
  const { email } = req.body;
  res.json({ message: "주문 목록 조회" });
};

export const getOrderDetail = (req, res) => {
  const { email } = req.body;
  res.json({ message: "주문 상세 상품 조회" });
};

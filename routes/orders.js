import express from "express";
import {
  getOrderDetail,
  getOrders,
  submitOrder,
} from "../controller/OrderController.js";
const orderRouter = express.Router();

orderRouter.use(express.json());

orderRouter.post("/", submitOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderDetail);

export default orderRouter;

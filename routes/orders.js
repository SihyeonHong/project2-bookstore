import express from "express";
import {
  getOrderDetail,
  getOrders,
  order,
} from "../controller/OrderController.js";
const orderRouter = express.Router();

orderRouter.use(express.json());

orderRouter.post("/", order);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderDetail);

export default orderRouter;

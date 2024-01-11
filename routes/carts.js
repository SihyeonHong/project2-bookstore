import express from "express";
import {
  addToCart,
  deleteCartItem,
  getCart,
} from "./../controller/CartController.js";
const cartRouter = express.Router();

cartRouter.use(express.json());

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.delete("/:id", deleteCartItem);

export default cartRouter;

import express from "express";
const orderRouter = express.Router();

orderRouter.use(express.json());

export default orderRouter;

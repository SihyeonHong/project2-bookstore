import express from "express";
const cartRouter = express.Router();

cartRouter.use(express.json());

export default cartRouter;

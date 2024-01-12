import { StatusCodes } from "http-status-codes";
import Database from "./../mariadb.js";

export const order = (req, res) => {
  res.json({ message: "주문하기" });
};

export const getOrders = (req, res) => {
  res.json({ message: "주문 목록 조회" });
};

export const getOrderDetail = (req, res) => {
  res.json({ message: "주문 상세 상품 조회" });
};

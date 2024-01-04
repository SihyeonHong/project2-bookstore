import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

app.listen(process.env.PORT);

import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import likeRouter from "./routes/likes.js";
import cartRouter from "./routes/carts.js";
import orderRouter from "./routes/orders.js";
import categoryRouter from "./routes/categories.js";

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/categories", categoryRouter);

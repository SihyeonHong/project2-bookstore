import express from "express";
const userRouter = express.Router();
import {
  join,
  login,
  requestResetPW,
  resetPW,
} from "./../controller/UserController.js";

userRouter.use(express.json());

userRouter.post("/join", join);

userRouter.post("/login", login);

userRouter.post("/reset", requestResetPW);

userRouter.put("/reset", resetPW);

export default userRouter;

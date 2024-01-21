import { StatusCodes } from "http-status-codes";
import UserRepository from "../repository/UserRepository.js";
import { generateToken } from "../middleware/jwt.js";

const userRepo = new UserRepository();

export const join = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await userRepo.insertNewUser(email, password);
    const statusCode =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await userRepo.findID(email);
    const token = generateToken(password, rows[0]);

    let statusCode = StatusCodes.BAD_REQUEST; //default
    if (token) {
      res.cookie("token", token, { httpOnly: true });
      statusCode = StatusCodes.OK;
    }
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const requestResetPW = async (req, res) => {
  try {
    const { email } = req.body;

    const rows = await userRepo.findID(email);
    return rows[0]
      ? res.status(StatusCodes.OK).json({ email: rows[0].email })
      : res.status(StatusCodes.UNAUTHORIZED).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const resetPW = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await userRepo.updatePW(email, password);
    const statusCode =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

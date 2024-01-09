import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Database from "./../mariadb.js";

dotenv.config();

export const join = async (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
  const values = [email, hashPassword, salt];

  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    const statusCode =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const [rows, fields] = await Database.runQuery(sql, [email]);
    const logInUser = rows[0];
    const hashPassword = crypto
      .pbkdf2Sync(password, logInUser.salt, 10000, 10, "sha512")
      .toString("base64");

    let statusCode = StatusCodes.BAD_REQUEST;
    if (logInUser && logInUser.password == hashPassword) {
      const token = jwt.sign(
        {
          email: logInUser.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "30m",
          issuer: "hongsi",
        }
      );
      res.cookie("token", token, { httpOnly: true });
      statusCode = StatusCodes.OK;
    }
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const requestResetPW = async (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const [rows, fields] = await Database.runQuery(sql, [email]);
    return rows[0]
      ? res.status(StatusCodes.OK).json({ email: rows[0].email })
      : res.status(StatusCodes.UNAUTHORIZED).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const resetPW = async (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
  const values = [hashPassword, salt, email];

  try {
    const [rows, fields] = await Database.runQuery(sql, values);
    const statusCode =
      rows && rows.affectedRows ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
    return res.status(statusCode).end();
  } catch (err) {
    console.log(err.code);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

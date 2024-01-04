import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { conn } from "./../mariadb.js";

dotenv.config();

export const join = (req, res) => {

  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
  const values = [email, hashPassword, salt];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};


export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const logInUser = results[0];
    const hashPassword = crypto
      .pbkdf2Sync(password, logInUser.salt, 10000, 10, "sha512")
      .toString("base64");

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
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

export const requestResetPW = (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({ email: email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

export const resetPW = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
  const values = [hashPassword, salt, email];
  conn.query(sql, values, (err, results) => {
    if (err || results.affectedRows == 0) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).end();
    }
  });
};

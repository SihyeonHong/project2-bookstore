import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (password, logInUser) => {
  const hashPassword = crypto
    .pbkdf2Sync(password, logInUser.salt, 10000, 10, "sha512")
    .toString("base64");
  let token;
  if (logInUser && logInUser.password == hashPassword) {
    token = jwt.sign(
      {
        email: logInUser.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30m",
        issuer: "hongsi",
      }
    );
  }
  return token;
};

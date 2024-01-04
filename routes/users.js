const express = require("express");
const router = express.Router();
const {
  join,
  login,
  requestResetPW,
  resetPW,
} = require("./../controller/UserController");

router.use(express.json());

router.post("/join", join);

router.post("/login", login);

router.post("/reset", requestResetPW);

router.put("/reset", resetPW);

module.exports = router;

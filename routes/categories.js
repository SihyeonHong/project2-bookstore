const express = require("express");
const router = express.Router();
const categories = require("./../controller/CategoryController");

// router.use(express.json());

router.get("/", categories);

module.exports = router;

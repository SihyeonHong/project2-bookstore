const express = require("express");
const router = express.Router();
const { allBooks, booksDetail } = require("./../controller/BookController");

// router.use(express.json());

router.get("/", allBooks);
router.get("/:id", booksDetail);

module.exports = router;

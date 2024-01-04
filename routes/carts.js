import express from "express";
const cartRouter = express.Router();

cartRouter.use(express.json());

/* router.post("/join", (req, res) => {
  res.json("회원가입");
});

router.post("/login", (req, res) => {
  res.json("로그인");
});

router.post("/reset", (req, res) => {
  res.json("비번 초기화 요청");
});

router.put("/reset", (req, res) => {
  res.json("비번 초기화");
}); */

export default cartRouter;

import express from "express";
import { categories } from "./../controller/CategoryController.js";

// router.use(express.json());

const categoryRouter = express.Router();
categoryRouter.get("/", categories);

export default categoryRouter;

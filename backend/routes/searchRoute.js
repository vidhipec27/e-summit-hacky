import express from "express";
import { searchInvestor } from "../controllers/searchInvestor.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router=express.Router();

router.get("/investor", searchInvestor);

export default router;
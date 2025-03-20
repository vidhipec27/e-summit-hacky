import express from "express";
import { searchInvestor } from "../controllers/searchInvestor.js";
import { searchInvestorDomain } from "../controllers/searchInvestor.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router=express.Router();

router.get("/investor", verifyToken, searchInvestor);
router.get("/investor/:domain", verifyToken, searchInvestorDomain);

export default router;
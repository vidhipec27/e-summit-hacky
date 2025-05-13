import express from "express";
import { searchInvestor } from "../controllers/searchInvestor.js";
import { searchInvestorDomain } from "../controllers/searchInvestor.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { searchEntre, searchEntreName, searchEntreScore } from "../controllers/searchEntre.js";
import { getInvestorDetails } from "../controllers/searchInvestor.js";
const router=express.Router();

router.get("/investor", verifyToken, searchInvestor);
router.get("/investor/:domain", verifyToken, searchInvestorDomain);
//router.get("/entre",verifyToken,searchEntre);
router.get("/entre", verifyToken, searchEntreScore);
router.get("/entre/:name", verifyToken, searchEntreName);
router.post("/investor/details", verifyToken, getInvestorDetails);
export default router;
import express from "express";
import { searchInvestorFiltered, storeSearches, getSearches } from "../controllers/searchInvestor.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { searchEntre, searchEntreName, searchEntreScore, getEntreDetails } from "../controllers/searchEntre.js";
import { getInvestorDetails, } from "../controllers/searchInvestor.js";
const router=express.Router();

router.get("/investor/:domain/:experience/:name", verifyToken, searchInvestorFiltered);
router.post("/investor/storesearch", verifyToken, storeSearches);
router.get("/investor/getsearch/:name", verifyToken, getSearches);

//router.get("/entre",verifyToken,searchEntre);
router.get("/entre", verifyToken, searchEntreScore);
router.get("/entre/:name", verifyToken, searchEntreName);
router.get("/entre/details/:emailid", verifyToken, getEntreDetails);
router.post("/investor/details", verifyToken, getInvestorDetails);
export default router;
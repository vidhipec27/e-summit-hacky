import express from "express";
import { entreLogin,entreRegister, details } from "../controllers/entreControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { InvestorLogin, InvestorRegister, detailsIn } from "../controllers/investorController.js";

const router=express.Router();

//entrepreneur routes
router.post("/entre/register",entreRegister);
router.post("/entre/login",entreLogin);
router.post("/investor/register", InvestorRegister);
router.post("/investor/login", InvestorLogin);
router.get("/details", verifyToken, details);
router.get("/detailsIn",verifyToken,detailsIn);


export default router;
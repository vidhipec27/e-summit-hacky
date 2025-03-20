import express from "express";
import { entreLogin,entreRegister } from "../controllers/entreControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router=express.Router();

//entrepreneur routes
router.post("/entre/register",entreRegister);
router.post("/entre/login",entreLogin);
// router.get("/details", verifyToken, details);


export default router;
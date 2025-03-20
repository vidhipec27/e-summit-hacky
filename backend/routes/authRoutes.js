import express from "express";
import { register, login, details } from "../src/controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/details", verifyToken, details);


export default router;
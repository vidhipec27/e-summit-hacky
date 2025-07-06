import express from "express";
import { entreLogin,entreRegister, details, completeEntreRegister, checkCompleteEntreRegister, updatePitchVisibility } from "../controllers/entreControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { InvestorLogin, detailsIn, investorRegister, completeInvestorRegister, checkCompleteInvestorRegister } from "../controllers/investorController.js";
import { upload,cloudinaryFile } from "../middleware/cloudinary.js";
import { videoDuration } from "../middleware/videoLength.js";
import { audioTranscribe } from "../middleware/audioTranscribe.js";

const router=express.Router();

//entrepreneur routes
router.post("/entre/login",entreLogin);
router.post("/entre/register1", entreRegister);
router.post("/entre/register2", verifyToken, upload, videoDuration,audioTranscribe, cloudinaryFile,completeEntreRegister);
router.get("/entre/checkregistration", verifyToken, checkCompleteEntreRegister);
router.post("/entre/uploadVideo",verifyToken,upload, videoDuration,audioTranscribe, cloudinaryFile);
router.put("/entre/updatePitchVisibility", verifyToken, updatePitchVisibility);
// router.post("/entre/uploadVideo",verifyToken,upload, videoDuration, cloudinaryFile);

router.post("/investor/register1", investorRegister);
router.post("/investor/register2", verifyToken, completeInvestorRegister);
router.get("/investor/checkregistration", verifyToken, checkCompleteInvestorRegister);

router.post("/investor/login", InvestorLogin);
router.get("/details", verifyToken, details);
router.get("/detailsIn",verifyToken,detailsIn);


export default router;
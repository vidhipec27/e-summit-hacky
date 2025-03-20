import express from "express";
import dotenv from "dotenv";
//import multer from "multer";
import cors from 'cors';
import { connectDb } from "./db.js";

const app=express();
app.use(cors());

dotenv.config();//to load the environment variables

app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoute.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

app.use("/auth",authRoutes);
app.use("/search", searchRoutes);
app.use("/api", chatbotRoutes);

app.listen(5050,()=>{
    connectDb()
});

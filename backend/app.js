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

app.use("/auth",authRoutes);

app.listen(5050,()=>{
    connectDb()
});

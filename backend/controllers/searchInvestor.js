import Investor from "../models/investor.js";
import dotenv from 'dotenv'; 
dotenv.config(); 

export const searchInvestor=async(req,resp)=>{
    try{
        const domain=req.body.domain;
        const result=await Investor.find({domain:domain});
        resp.status(200).json({success:true,result});
    }
    catch(error){

    }
}
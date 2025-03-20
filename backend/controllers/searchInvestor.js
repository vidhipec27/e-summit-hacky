import Investor from "../models/investor.js";
import dotenv from 'dotenv'; 
dotenv.config(); 

export const searchInvestorDomain=async(req,resp)=>{
    try{
        const domain=req.params.domain;
        console.log(domain);
        const result=await Investor.find({domain:domain});
        console.log(result);
        resp.status(200).json({success:true,result});
    }
    catch(error){
        console.log("error in searching particular investors", error);
        resp.status(500).send(error);
    }
}

export const searchInvestor = async(req, resp) => {
    try {
        const result = await Investor.find();
        console.log(result)
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching investors", error);
        resp.status(500).send(error);
    }
}
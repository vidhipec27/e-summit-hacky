import Investor from "../models/investor.js";
import dotenv from 'dotenv'; 
import { createClient } from 'redis';

const client = createClient( {url: process.env.REDIS_URL});
await client.connect();
const DEFAULT_EXPIRATION = 3600 //setting expiration time for redis cache as one hour
console.log("redis client connected!");

dotenv.config(); 

// export const searchInvestorDomain=async(req,resp)=>{
//     try{
//         const domain=req.params.domain;
//         console.log(domain);
//         const result=await Investor.find({domain:domain});
//         console.log(result);
//         resp.status(200).json({success:true,result});
//     }
//     catch(error){
//         console.log("error in searching particular investors", error);
//         resp.status(500).send(error);
//     }
// }

// export const searchInvestor = async(req, resp) => {
//     try {
//         const result = await Investor.find();
//         resp.status(200).json({success:true,result});
//     } catch (error) {
//         console.log("error in searching investors", error);
//         resp.status(500).send(error);
//     }
// }

export const searchInvestorFiltered = async (req, resp) => {
    try {
        const experience = req.params.experience;
        const domain = req.params.domain;
        const name = req.params.name;
        
        const query = {
            ...(experience !== '!' && { experience }),
            ...(domain !== '!' && { domain }),
            ...(name !== '!' && { username: new RegExp("^" + name, "i") }),
        };
        
        const result = await Investor.find(query);
        // console.log(result);

        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in filtering investors", error);
        resp.status(500).send(error);
    }
}

export const getInvestorDetails = async(req, resp) => {
    try {
        const email = req.body.emailid;
        const result = await Investor.find({emailid: email});
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching investors", error);
        resp.status(500).send(error);
    }
}
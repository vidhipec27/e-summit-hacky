import Entre from '../models/entre.js';
import dotenv from 'dotenv'; 
dotenv.config(); 

export const searchEntreName=async(req,resp)=>{
    try{
        const name=req.params.name;
        console.log(name);
        const result=await Entre.find({username:name});
        console.log(result);
        resp.status(200).json({success:true,result});
    }
    catch(error){
        console.log("error in searching particular entre", error);
        resp.status(500).send(error);
    }
}
export const searchEntre = async(req, resp) => {
    try {
        const result = await Entre.find();
        console.log(result)
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching entrepreneurs", error);
        resp.status(500).send(error);
    }
}
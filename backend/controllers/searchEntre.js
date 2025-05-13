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
export const searchEntreScore=async(req,resp)=>{
    try{
        const entre=await Entre.find();
        const scored=entre.map((entry)=>{
            const score=entry.feedback?(((entry.startupStage*20)+(entry.teamSize*4)+
    (entry.experience*7)+(entry.feedback*15))*0.581):(((entry.startupStage*20)+(entry.teamSize*4)+
    (entry.experience*7))*1.031);
    return{
        username:entry.username,
        emailid:entry.emailid,
        number:entry.number,
        needFunding:entry.needFunding,
        score:Number(score.toFixed(2))
    }
        });
    const result=scored.sort((a,b)=>b.score-a.score).slice(0,20);
    resp.status(200).json({success:true,result});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
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
export const getEntreDetails = async(req, resp) => {
    try {
        const email = req.params.emailid;
        const result = await Entre.find({emailid: email});
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching entre", error);
        resp.status(500).send(error);
    }
}
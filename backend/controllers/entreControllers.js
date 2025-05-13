import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Entre from "../models/entre.js";
import dotenv from 'dotenv'; 
dotenv.config(); 

const key=process.env.JWT_SECRET;

//REGISTER
export const entreRegister=async (req,resp)=>{
    //console.log(req.body);
    try{
        const{
            username,
            emailid,
            password,
            number,
            needFunding,
            startupStage,
            teamSize,
            experience,}=req.body;
        if (!emailid || emailid.trim() === '') {
            return resp.status(400).json({ message: 'Email is required' });
        }
        const existingUser = await Entre.findOne({ emailid });
        if (existingUser) {
        return resp.status(400).json({success: false, message: "Email already registered" });
    }
        const salt=await bcrypt.genSalt();
        const passwordF=await bcrypt.hash(password, salt);
        const newEntre=new Entre({
            username,
            emailid,
            password:passwordF,
            number,
            needFunding,
            startupStage,
            teamSize,
            experience,
        });
        const saveUser=await newEntre.save();

        const token=jwt.sign({emailid:emailid, role:"entre"},key);
        console.log(token);
        // const userObject =  saveUser.toObject(); // we need to convert this to plain object
        // delete userObject.password;

        //delete currentUser.password;//this doesn't work

        resp.json({success: true,token});

        
    }
    catch(error){
        console.log("this is the error in registering, ", error);
        resp.status(500).json({"error":error.message});
    }
};

//LOGIN
export const entreLogin=async(req,resp)=>{
    try{
        const {emailid,password}=req.body;
        const currentUser=await Entre.findOne({emailid:emailid});
        if(!currentUser){
            return resp.status(404).json({message:"User not found"});
        }
        const boolean=await bcrypt.compare(password,currentUser.password);
        if(!boolean){
            return resp.status(200).json({success: false, message:"Invalid credentials. Please check again!"});
        }
        const token=jwt.sign({emailid:emailid, role:"entre"},key);
        console.log(token);
        // const userObject = currentUser.toObject(); // we need to convert this to plain object
        // delete userObject.password;

        //delete currentUser.password;//this doesn't work

        resp.json({success: true,token});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
    }
}

//GET details
export const details=async(req,resp)=>{
    try {
        const emailid=req.user.emailid;
        const currentUser=await Entre.findOne({emailid:emailid});
        resp.json({username:currentUser.username});
    } catch (error) {
        console.log("there has been an error ", error);
        resp.status(500).message("there has been an error oopsie poopsie");
    }
}

// export const getEntreScore=async(req,resp)=>{
//     try{
//         const entry=await Entre.find();
//         const score=entry.feedback?(((entry.startupStage*20)+(entry.teamSize*4)+
//     (entry.experience*7)+(entry.feedback*15))*0.581):(((entry.startupStage*20)+(entry.teamSize*4)+
//     (entry.experience*7))*1.031);
//     resp.json(score);
//     }
//     catch(error){
//         resp.json({"error":error.message});
//     }
// }
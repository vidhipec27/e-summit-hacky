import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Investor from "../models/investor.js";
import dotenv from 'dotenv'; 
dotenv.config(); 

const key=process.env.JWT_SECRET;

//REGISTER
export const InvestorRegister=async (req,resp)=>{
    //console.log(req.body);
    try{
        const{
            username,
            emailid,
            password,
            number,
            willFund,
            domain,
            experience,
            expertise
        }=req.body;
        if (!emailid || emailid.trim() === '') {
            return resp.status(400).json({ message: 'Email is required' });
        }
        const existingUser = await Investor.findOne({ emailid });
        if (existingUser) {
        return resp.status(400).json({success: false, message: "Email already registered" });
    }
        const salt=await bcrypt.genSalt();
        const passwordF=await bcrypt.hash(password, salt);
        const newInvestor=new Investor({
            username,
            emailid,
            password:passwordF,
            number,
            willFund,
            domain,
            experience,
            expertise
        });
        const saveUser=await newInvestor.save();

        const token=jwt.sign({emailid:emailid},key);
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
export const InvestorLogin=async(req,resp)=>{
    try{
        const {emailid,password}=req.body;
        const currentUser=await Investor.findOne({emailid:emailid});
        if(!currentUser){
            return resp.status(404).json({message:"User not found"});
        }
        const boolean=await bcrypt.compare(password,currentUser.password);
        if(!boolean){
            return resp.status(200).json({success: false, message:"Invalid credentials. Please check again!"});
        }
        const token=jwt.sign({emailid:emailid},key);
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
        const currentUser=await Investor.findOne({emailid:emailid});
        resp.json({username:currentUser.username});
    } catch (error) {
        console.log("there has been an error ", error);
        resp.status(500).message("there has been an error oopsie poopsie");
    }
}
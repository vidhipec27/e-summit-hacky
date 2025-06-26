import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Entre from "../models/entre.js";
import dotenv from 'dotenv'; 
dotenv.config(); 

const key=process.env.JWT_SECRET;

//REGISTER
export const entreRegisterTemp =async (req,resp)=>{
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
            experience,
        videopath,
    transcript,}=req.body;
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
            videopath,
            transcript,
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

//REGISTER

export const entreRegister =async (req,resp)=>{
    //console.log(req.body);
    try{
        const{
            username,
            emailid,
            password,
            }=req.body;
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
        });
        const saveUser=await newEntre.save();
        const token=jwt.sign({emailid:emailid, role:"entre"},key);
        resp.json({success: true,token});

        
    }
    catch(error){
        console.log("this is the error in registering, ", error);
        resp.status(500).json({"error":error.message});
    }
};

export const completeEntreRegister = async(req, resp) => {
    try {
        const{
            number,
            needFunding,
            startupStage,
            teamSize,
            experience,}=req.body;

        const userid = req.user.emailid;

        const videopath=req.body.videopath;
        console.log("uhm",videopath);
        const transcript=req.body.transcript;
        
        const user = await Entre.findOneAndUpdate({emailid: userid}, {
            number, 
            startupStage,
            needFunding,
            teamSize,
            experience,
            videopath,
            transcript,
            completeRegistration: true
        });

        resp.status(200).json({ message: "Registration completed successfully." });
    } catch (error) {
        console.log("this is the error in completing details for entre ", error);
        resp.status(500).json({"error": error.message});
    }
}

export const checkCompleteEntreRegister = async (req, resp) => {
    try {
        const userid = req.user.emailid;
        const user = await Entre.findOne({emailid: userid});
        
        console.log(user);
        const check = user.completeRegistration;
        // console.log(check);
        return resp.status(200).json({registered: check});
    } catch (error) {
        console.log("there is an error in checking if entre has completely registered");
        console.log(error.message);
        resp.status(500).json({"error": error.message});
    }
}

//LOGIN
export const entreLogin=async(req,resp)=>{
    try{
        const {emailid,password}=req.body;
        console.log(emailid);
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
        console.log("printing->>>>>>>>>>>>>>>>>>",currentUser.username);
        resp.json({username:currentUser.username});
    } catch (error) {
        console.log("there has been an error ", error);
        resp.status(500).json("there has been an error oopsie poopsie");
    }
}

//add feedback
export const addFeedback=async(req,resp)=>{
    try{
    const entreId=req.params.emailid;
    const entre=await Entre.findOne({emailid:entreId});
    if(!entre)
        resp.status(404).json("entre not found");
    
    const hasRated = entre.feedback.some(feedback => feedback.investorId === req.body.investorId);
        if (hasRated) {
            return resp.status(400).json({ error: 'Investor has already submitted feedback.' });
        }

    const newFeedback={
        investorId:req.body.investorId,
        rating:req.body.rating,
    }
    entre.feedback.push(newFeedback);
    const totalRatings = entre.feedback.length;
    const totalSum = entre.feedback.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalSum / totalRatings;
    entre.averageRating=averageRating;
    await entre.save();
    resp.status(200).json({success:true,entre});
}
catch(error){
    resp.status(500).json({"error":error.message});
}
}
import Message from "../models/Message.js";

export const sendMessage=async(req,resp)=>{
    try{
    const senderEmail=req.user.emailid;
    const {receiverEmail, message, convoId}=req.body;

    const newMessage=new Message({
        conversationId: convoId,
        sender: senderEmail,
        receiver: receiverEmail,
        text:message,
    })
    const saved=await newMessage.save();
    resp.status(200).json({success:true,saved});
    }
    catch(error){
        resp.status(500).json({"error":error.message})
    }
}

export const getMessage=async(req,resp)=>{
    try{
        const convoId=req.params.convoId;
        const messages=await Message.find({conversationId:convoId});
        resp.status(200).json({success:true, messages});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
    }
}
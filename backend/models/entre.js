import mongoose from "mongoose"
const schema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    emailid:{
        type:String,
        required:true,
        unique:true,
        }, 
    password:{
        type:String,
        required:true,
    },
    number:{
        type:String,
        required:true,
    },
    needFunding:{
        type:Boolean,
        required:true,
    },
    startupStage:{
        type:Number,
        required:true,
    },
    experience:{
        type:Number,
        required:true,
    },
    teamSize:{
        type:Number,
        required:true,
    },
    feedback:{
        type:Number,
        required:false
    },
    },
    {timestamps:true}
)
const Entre=mongoose.model("entrep",schema);
export default Entre;
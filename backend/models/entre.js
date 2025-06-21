import mongoose from "mongoose"
import schemaRating from "./rating.js";
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
        type:[schemaRating],
        required:false
    },
    averageRating:{
        type:Number,
        defualt:0,
    },
    videopath:{
        type:String,
    },
    transcript:{
        type:String,
    },
    },
    {timestamps:true}
)
const Entre=mongoose.model("entrep",schema);
export default Entre;
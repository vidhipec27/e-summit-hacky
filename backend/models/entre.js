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
        required:false,
    },
    needFunding:{
        type:Boolean,
        required:false,
    },
    startupStage:{
        type:Number,
        required:false,
    },
    experience:{
        type:Number,
        required:false,
    },
    teamSize:{
        type:Number,
        required:false,
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
    completeRegistration: {
        type: Boolean,
        default: false
    },
     allowPitchVisibility: {
        type: Boolean,
        default: false
    }
    },
    {timestamps:true}
)
const Entre=mongoose.model("entrep",schema);
export default Entre;
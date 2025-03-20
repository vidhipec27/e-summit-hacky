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
        type:Number,
        required:true,
    },
    needFunding:{
        type:Boolean,
        required:true,
    },
    },
    {timestamps:true}
)
const Entre=mongoose.model("entrep",schema);
export default Entre;
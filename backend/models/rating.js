import mongoose from "mongoose";
const schema=new mongoose.Schema({
    investorId:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    }},
    {timestamps:true}
)
export default schema;
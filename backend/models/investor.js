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
        required:false,
    },
    willFund:{
        type:Boolean,
        required:false,
    },
    domain:{
        type:String,
        required:false,
    },
    experience:{
        type:String,
    },
    expertise:{
        type:String
    },
    completeRegistration: {
        type: Boolean,
        default: false
    }
    },
    {timestamps:true}
)
const Investor=mongoose.model("investor",schema);
export default Investor;
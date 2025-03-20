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
    willFund:{
        type:Boolean,
        required:true,
    },
    domain:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
    },
    expertise:{
        type:String
    }

    },
    {timestamps:true}
)
const Investor=mongoose.model("investor",schema);
export default Investor;
import mongoose from "mongoose";

const schema=mongoose.Schema;

const userSchema=new schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    role:{
            type:String,
            enum:["admin","supervisior","operator"],
            default:"operator"
    },
    createAt:{  
        type:Date,
        default:Date.now()
    }
})

const UserModel=mongoose.model("User",userSchema); 

export default UserModel;
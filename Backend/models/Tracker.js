import mongoose from "mongoose";

const schema=mongoose.Schema;

const trackerSchema=new schema({
    name:{
        type:String,
        required:true
    },
    action:{
        type:String,
        required:true
    },
    messgage:{
        type:String,
        required:true
    },
    stage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductStage"
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
})


export default mongoose.model("Tracker",trackerSchema);
import mongoose from "mongoose";


const schema=mongoose.Schema;   

const CheckListStage=new schema({
    title:{
        type:String,
        required:true
    },
    stage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductStage"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CheckList"
    }],
    AssingedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    

})

export default mongoose.model("CheckListStage",CheckListStage);
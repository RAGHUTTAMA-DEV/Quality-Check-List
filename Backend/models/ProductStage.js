import mongoose from "mongoose";

import UserModel from "./UserSchema.js";

const schema=mongoose.Schema;


const ProdunctStage=new schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  description:{
    type:String,
    required:true
  },
  createAt:{
    type:Date,
    default:Date.now()
  },
  statedAt:{
    type:Date,
    
  },
  endedAt:{
    type:Date,
  },
  status:{
     type:String,
     enum:["pending","inProgress","completed"],
     default:"pending"
  },
  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:UserModel,
  }

})

const ProductStageModel=mongoose.model("ProductStage",ProdunctStage);


export default ProductStageModel;
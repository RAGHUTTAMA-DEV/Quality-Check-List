import StageModel from "../models/ProductStage.js";
import UserModel from "../models/UserSchema.js";
export async function GetAllStages(req,res){
     try{
        const stages=await StageModel.find();
        if(!stages){
            return res.status(404).json({message:"No Stages Found"});
        }
        res.status(200).json(stages,{message:"All Stages"});
     }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
     }
}

export async  function GetStage(req,res){
    try{
        const stage=await StageModel.findById(req.params.id);
      
        if(!stage){
            return res.status(404).json({message:"Stage not found"});
        }
        res.status(200).json(stage,{message:"Stage Found"});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
} 

export async function UpdateStage(req,res){
    try{
        const updateData=req.body;

        const Updated=await StageModel.findByIdAndUpdate(req.params.id,{
            $set:updateData},{new:true},
        );

        res.status(200).json(Updated,{message:"Stage Updated"});


    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}

export async function DeleteStage(req,res){
     try{
        const stage=await StageModel.findOneAndDelete(req.params.id);
        if(!stage){
            return res.status(404).json({message:"Stage not found"});
        }
        res.status(200).json(stage,{message:"Stage Deleted"});  

     }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
     }
}

export async function CreateStage(req,res){
    try{
        const {name,description,status,statedAt,assignedTo}=req.body;
         const stage=await StageModel.create(req.body);

         res.status(201).json(stage,{message:"Stage Created"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }   
}
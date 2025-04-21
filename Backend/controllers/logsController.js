import Tracker from "../models/Tracker";


async function CreateLog(req,res){
    try{
       const {message,action,name,stage}=req.body;
       await Tracker.create({message,action,name,stage});
       res.status(201).json({message:"Log Created"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function GetAllLogs(req,res){
     try{
          const logs=await Tracker.find();
          res.json({
            logs,message:"Logs Fetched"
          }) 
     }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
     }
}

async function GetLogs(req,res){
    try{
        const {id}=req.params.id;
        const logs=await Tracker.findById(id);
        res.json({
            logs,message:"Logs Fetched"
        })

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}


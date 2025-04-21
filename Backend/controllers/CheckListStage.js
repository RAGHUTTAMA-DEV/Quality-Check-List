import CheckListStage from "../models/CheckListStage.js";

async function PostCheckListItem(req,res){
   try{
    const {title,items,stage}=req.body;
    await CheckListStage.create({title,items,stage});
    res.status(201).json({message:"CheckListStage Created"});
   }catch(err){
     console.log(err);
     res.status(500).json({message:"Internal Server Error"});   
   }
}

async function UpdateCheckListItem(req,res){
   try{
      const {id}=req.params.id;
      const updateItems=req.body;
      await CheckListStage.findByIdAndUpdate(id,{
        $set:updateItems
      })

      res.status(200).json({message:"CheckListStage Updated"});

   }catch(err){
     console.log(err);
     res.status(500).json({message:"Internal Server Error"});
   }
}

async function DeleteCheckListItem(req,res){
    try{
        const {id}=req.params.id;
        await CheckListStage.findByIdAndDelete(id);


    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function MarkChecListItem(req,res){
    try{
        const {itemsId}=req.params.itemsId;
        const {mark}=req.body;
        await CheckListStage.findByIdAndUpdate(itemsId,{
            $set:{
                mark
            }
        })
        res.status(200).json({message:"CheckListStage Updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export {PostCheckListItem,UpdateCheckListItem,DeleteCheckListItem,MarkChecListItem};
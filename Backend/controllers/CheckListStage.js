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

async function GetAllCheckListItems(req,res){
    try{
        const checkListItems=await CheckListStage.find();
        res.status(200).json({checkListItems,message:"CheckListItems Fetched"});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function UpdateCheckListItem(req,res){
   try{
      const {title}=req.params.title;
      const updateItems=req.body;
      await CheckListStage.findByIdAndUpdate(title,{
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
        const {title}=req.params.title;
        await CheckListStage.findByIdAndDelete(title);


    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function MarkCheckListItem(req,res){
    try{
        const {title}=req.params.title;
        const {mark}=req.body;
        await CheckListStage.findOneAndUpdate(itemsId,{
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

export {PostCheckListItem,UpdateCheckListItem,DeleteCheckListItem,MarkCheckListItem,GetAllCheckListItems};
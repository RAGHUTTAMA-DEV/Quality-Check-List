import CheckListModel from "../models/CheckList.js";
export async function CreateCheckList(req,res){
   try{
     const {content,isChecked,coments,Image,checkedBy}=req.body;

     await CheckListModel.create({
        content,
        isChecked,
        coments,checkedBy,Image
     });

     res.json({message:"CheckList Created"});

   }catch(err){
      console.log(err);
      res.json({message:"Erroar"});
   }
}

export async  function GetAllCheckList(req,res){
   try{
    const checkList=await CheckListModel.find();
    res.json({checkList,message:"CheckList Found"});
    console.log(checkList);
   }catch(err){
     console.log(err);
      res.json({message:"Erroar"});
   }
}

export async function GetCheckList(req,res){
      try{
        const checkList=await CheckListModel.findById(req.params.id);
        res.json({checkList,message:"CheckList Found"});


      }catch(err){
         console.log(err);
        res.json({message:"Erroar"});
      }
}

export async function UpdateCheckList(req,res){
   try{
    const updateData=req.body;
    const checkList=await CheckListModel.findByIdAndUpdate(req.params.id,{
        $set:updateData
        ,message:"CheckList Updated"
    })
    res.json({checkList,message:"CheckList Updated"});


   }catch(err){
     console.log(err);
      res.json({message:"Erroar"});
   }
}

export async function DeleteCheckList(req,res){ 
    try{ 
        const checkList=await CheckListModel.findByIdAndDelete(req.params.id);
        res.json({checkList,message:"CheckList Deleted"});


    }catch(err){
        console.log(err);
        res.json({message:"Erroar"});
    }
}
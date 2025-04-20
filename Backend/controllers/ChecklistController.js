import CheckListModel from "../models/CheckList.js";
export async function CreateCheckList(req,res){
   try{
     const {content,isChecked,coments,Image}=req.body;

     await CheckListModel.create({
        content,
        isChecked,
        comments
     });

   }catch(err){
      console.log(err);
      res.json({message:"Erroar"});
   }
}

export function GetAllCheckList(req,res){

}

export function GetCheckList(req,res){
   
}

export function UpdateCheckList(req,res){

}

export function DeleteCheckList(req,res){ 

}
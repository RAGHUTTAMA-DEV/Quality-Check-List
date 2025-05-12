import express from "express";
import { SignUp,SignIn,Getme } from "../controllers/authController.js";
import { authorize,auth } from "../middleware/authorize.js";
import axios from 'axios';
import Predictions from "../models/Predictions.js";
const router=express.Router();  



router.post('/signup',SignUp);

router.post('/signin',SignIn);

router.get('/me',auth,Getme)

router.post('/message',auth,authorize('admin'),async (req,res)=>{
     try{
        const supervisior=req.params.supervisor;
        const response=await axios.post('http://localhost:5000/predict',{supervisor:supervisior});
        const {from,message,prediction}=req.body;
        await Predictions.create({
            from,
            message,
            prediction,
            supervisor:supervisior,
        })
        res.status(201).json({message:"Message sent to supervisor"})
     }catch(err){
        console.log(err);
     }
})

router.delete('/delete/:username',auth,async (req,res)=>{
    try{
     const res=await User.findByIdAndDelete(req.params.username);
     res.status(200).json({message:"User deleted"})
    }catch(err){
        console.lof(err);
    }
})

export default router;  
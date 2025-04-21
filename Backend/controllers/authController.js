import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
async function SignUp(req,res){
  try{
    const {username,email,password,role}=req.body;
    //Will Add zod validation later
    const Check=await UserModel.findOne({email});
      if(Check){
       return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const newUser=new UserModel({
      username,
      email,
      password:hashedPassword,
      role
    });
    await newUser.save();

    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
    res.status(201).json({token,user:newUser});
    return;
  }catch(err){
     console.log(err);
     res.status(500).json({message:"Something went wrong"});
     return;
  }

}

async function SignIn(req,res){
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});

        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

        const { password: _, ...safeUser } = user._doc;
         res.status(200).json({ token, user: safeUser });

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"});
        return;
    }
}

async function Getme(req,res){
    try{
        const user=await UserModel.findById(req.user.id);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"});
        return;
    }
}

export {SignUp,SignIn,Getme};
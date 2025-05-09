import UserModel from "../models/UserSchema.js";

async function GetAllUsers(req,res){
    try{
        const users=await UserModel.find();
        res.status(200).json({users,message:"All Users"});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}

async function GetUser(req, res) {
    try {
        // Fix: Use the username from route params correctly
        const user = await UserModel.findOne({ username: req.params.username });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ user, message: "User Found" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

//Still have modifie this
async function UpdateUser(req,res){
    try{
        const {username,email,password,role}=req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.params.username,
            { username, email, password, role },
            { new: true }
          );
          
        res.status(200).json(user,{message:"User Updated"});
    }catch(err){
        console.log(err);   
        res.status(500).json({message:"Something went wrong"})
    }
}

async function DeleteUser(req,res){
     try{
        const user=await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json(user,{message:"User Deleted"});

     }catch(err){
        console.log(err);
        res.status(500).json({message:"Somethissng went wrong"})
     }
}

export{
    GetAllUsers,
    GetUser,
    UpdateUser,
    DeleteUser
}
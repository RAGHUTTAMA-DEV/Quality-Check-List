import jwt from 'jsonwebtoken';
import UserModel from '../models/UserSchema.js';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Token expires in 1 day
  );
};

async function SignUp(req, res) {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = generateToken(newUser);

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({ token, user: userWithoutPassword });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function SignIn(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({ token, user: userWithoutPassword });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function Getme(req,res){
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
        const user=await UserModel.findById(decodedToken.id);
        res.status(200).json({user});
        

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"});
    }
}
export {
    SignUp,
    SignIn,
    Getme
};
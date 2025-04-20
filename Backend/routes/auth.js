import express from "express";
import { SignUp,SignIn,Getme } from "../controllers/authController";

const router=express.Router();  



router.post('/signup',SignUp);

router.post('/signin',SignIn);

router.get('/me',Getme)

export default router;  
import express from "express";
import { SignUp,SignIn,Getme } from "../controllers/authController";
import { authorize,auth } from "../middleware/authorize";

const router=express.Router();  



router.post('/signup',SignUp);

router.post('/signin',SignIn);

router.get('/me',auth,Getme)

export default router;  
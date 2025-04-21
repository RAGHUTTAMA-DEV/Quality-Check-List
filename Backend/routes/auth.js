import express from "express";
import { SignUp,SignIn,Getme } from "../controllers/authController.js";
import { authorize,auth } from "../middleware/authorize.js";

const router=express.Router();  



router.post('/signup',SignUp);

router.post('/signin',SignIn);

router.get('/me',auth,Getme)

export default router;  
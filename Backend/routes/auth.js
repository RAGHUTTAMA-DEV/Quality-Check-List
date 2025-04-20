import express from "express";
import { SignUp,SignIn,Getme } from "../controllers/authController.js";
import {authorize} from "../middleware/authorize.js";

const router=express.Router();  



router.post('/signup',SignUp);

router.post('/signin',SignIn);

router.get('/me',authorize('admin','supervisor'),Getme)

export default router;  
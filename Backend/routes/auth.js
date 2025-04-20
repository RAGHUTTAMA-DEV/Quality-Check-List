import express from "express";
<<<<<<< HEAD
import { SignUp,SignIn,Getme } from "../controllers/authController";
=======
import { SignUp,SignIn,Getme } from "../controllers/authController.js";
import {authorize} from "../middleware/authorize.js";
>>>>>>> master

const router=express.Router();  



router.post('/signup',SignUp);

router.post('/signin',SignIn);

<<<<<<< HEAD
router.get('/me',Getme)
=======
router.get('/me',authorize('admin','supervisor'),Getme)
>>>>>>> master

export default router;  
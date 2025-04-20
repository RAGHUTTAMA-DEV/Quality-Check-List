import express from 'express';
import {GetAllUsers,GetUser,UpdateUser,DeleteUser} from '../controllers/usersController.js';

const router=express.Router();

router.get('/',GetAllUsers);
router.get('/:id',GetUser);

router.put('/:id',UpdateUser);

router.delete('/:id',DeleteUser);


export default router;
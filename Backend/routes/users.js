import express from 'express';
import {getAllUsers,getUser,updateUser,deleteUser} from '../controllers/usersController.js';

const router=express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUser);

router.put('/:id',updateUser);

router.delete('/:id',deleteUser);


export default router;
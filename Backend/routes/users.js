import express from 'express';
<<<<<<< HEAD
import {getAllUsers,getUser,updateUser,deleteUser} from '../controllers/usersController.js';

const router=express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUser);

router.put('/:id',updateUser);

router.delete('/:id',deleteUser);
=======
import {GetAllUsers,GetUser,UpdateUser,DeleteUser} from '../controllers/usersController.js';

const router=express.Router();

router.get('/',GetAllUsers);
router.get('/:id',GetUser);

router.put('/:id',UpdateUser);

router.delete('/:id',DeleteUser);
>>>>>>> master


export default router;
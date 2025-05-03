import express from 'express';
import {GetAllUsers,GetUser,UpdateUser,DeleteUser} from '../controllers/usersController.js';
import { authorize,auth } from '../middleware/authorize.js';

const router=express.Router();

router.get('/',auth,authorize('admin','operator'),GetAllUsers);
router.get('/get/:username',auth,authorize('admin','supervisor',),GetUser);

router.put('/geter/:user', auth, authorize('admin'), auth, authorize('admin'),UpdateUser);//NEed to be Changed

router.delete('/:id', auth, authorize('admin'),DeleteUser);


export default router;
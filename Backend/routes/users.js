import express from 'express';
import {getAllUsers,getUser,updateUser,deleteUser} from '../controllers/usersController.js';
import { authorize,auth } from '../middleware/authorize.js';

const router=express.Router();

router.get('/',auth,authorize('admin'),getAllUsers);
router.get('/:id',auth,authorize('admin','supervisor'),getUser);

router.put('/:id', auth, authorize('admin'), auth, authorize('admin'),updateUser);

router.delete('/:id', auth, authorize('admin'),deleteUser);


export default router;
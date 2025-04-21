import express from 'express';
import { GetAllStages,GetStage,DeleteStage,UpdateStage,CreateStage } from '../controllers/StageController';
import  { authorize,auth } from '../middleware/authorize';
const router=express.Router();

router.post('/',auth,authorize("admin","supervisor"),CreateStage);

router.get('/',auth,GetAllStages);

router.get('/:id',auth,GetStage)

router.put('/:id',auth,authorize("admin","supervisor"),UpdateStage);

router.delete('/:id',auth,authorize('admin','supervisor'),DeleteStage);




export default router;

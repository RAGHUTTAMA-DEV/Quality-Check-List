import express from 'express';
import { GetAllStages,GetStage,DeleteStage,UpdateStage,CreateStage } from '../controllers/StageController';
const router=express.Router();

router.post('/',CreateStage);

router.get('/',GetAllStages);

router.get('/:id',GetStage)

router.put('/:id',UpdateStage);

router.delete('/:id',DeleteStage);




export default router;

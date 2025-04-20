import express from "express";  
import { GetAllCheckList,GetCheckList,UpdateCheckList,DeleteCheckList,CreateCheckList } from "../controllers/ChecklistController";

const router=express.Router();


router.get('/',GetAllCheckList);

router.get('/:id',GetCheckList);
router.post('/',CreateCheckList);
router.put('/:id',UpdateCheckList);
router.delete('/:id',DeleteCheckList);


export default router;
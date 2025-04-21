import express from "express";  
import { GetAllCheckList,GetCheckList,UpdateCheckList,DeleteCheckList,CreateCheckList } from "../controllers/ChecklistController";
import { authorize,auth} from "../middleware/authorize";
const router=express.Router();


router.get('/',auth,authorize('admin'),GetAllCheckList);

router.get('/:id',auth,authorize('admin','supervisor'),GetCheckList);
router.post('/',auth,CreateCheckList);
router.put('/:id',,UpdateCheckList);
router.delete('/:id',auth,authorize('admin','supervisor'),DeleteCheckList);


export default router;
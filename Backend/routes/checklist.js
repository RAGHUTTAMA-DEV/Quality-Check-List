import express from "express";  
import { GetAllCheckList,GetCheckList,UpdateCheckList,DeleteCheckList,CreateCheckList } from "../controllers/ChecklistController.js";
import { authorize,auth} from "../middleware/authorize.js";
const router=express.Router();


router.get('/',auth,authorize('admin'),GetAllCheckList);

router.get('/:id',auth,authorize('admin','supervisor'),GetCheckList);
router.post('/',auth,CreateCheckList);
router.put('/:id',auth,authorize('admin','supervisor'),UpdateCheckList);
router.delete('/:id',auth,authorize('admin','supervisor'),DeleteCheckList);


export default router;
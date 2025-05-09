import express from "express";
import { GetAllCheckList, GetCheckList, UpdateCheckList, DeleteCheckList, CreateCheckList } from "../controllers/ChecklistController.js";
import { authorize, auth } from "../middleware/authorize.js";
import CheckListStage from "../models/CheckListStage.js";
const router = express.Router();

router.get('/', auth, authorize('admin'), GetAllCheckList); // GET all
router.get('/find', auth, authorize('admin', 'supervisor'), GetCheckList); // GET single by content
router.post('/', auth, CreateCheckList); // CREATE
router.put('/', auth, authorize('admin', 'supervisor'), UpdateCheckList); // UPDATE by content
router.delete('/', auth, authorize('admin', 'supervisor'), DeleteCheckList); // DELETE by content


export default router;

import express from 'express';
import CheckListModel from '../models/CheckList';
import {PostCheckListItem,UpdateCheckListItem,DeleteCheckListItem,MarkChecListItem} from '../controllers/CheckListStage';
const router=express.Router();

router.post('/checkList/:id/items',PostCheckListItem)

router.put('/items/:id',UpdateCheckListItem)

router.delete('/items/:id',DeleteCheckListItem)

router.post('/items/:itemsId/mark',MarkChecListItem);

export default router;
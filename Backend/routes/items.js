import express from 'express';

import {PostCheckListItem,UpdateCheckListItem,DeleteCheckListItem,MarkCheckListItem,GetAllCheckListItems} from '../controllers/CheckListStage.js';
const router=express.Router();

router.post('/checkList/:id/items',PostCheckListItem)

router.put('/items/:id',UpdateCheckListItem)

router.get('/items',GetAllCheckListItems)

router.delete('/items/:id',DeleteCheckListItem)

router.post('/items/:itemsId/mark',MarkCheckListItem);

export default router;
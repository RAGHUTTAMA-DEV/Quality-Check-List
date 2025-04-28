import express from 'express';

import {PostCheckListItem,UpdateCheckListItem,DeleteCheckListItem,MarkCheckListItem,GetAllCheckListItems} from '../controllers/CheckListStage.js';
const router=express.Router();

router.post('/checklist',PostCheckListItem)

router.put('/update/:title',UpdateCheckListItem)

router.get('/',GetAllCheckListItems)

router.delete('delete/:title',DeleteCheckListItem)

router.post('/mark/:title',MarkCheckListItem);

export default router;
import express from 'express';
import {
  PostCheckListItem,
  UpdateCheckListItem,
  GetAllCheckListItems,
  DeleteCheckListItem,
  MarkCheckListItem
} from '../controllers/CheckListStage.js';

const router = express.Router();

// Create a new item
router.post('/', PostCheckListItem);

// Update an item by title
router.put('/update/:title', UpdateCheckListItem);

// Get all items
router.get('/', GetAllCheckListItems);

// Delete an item by title - fixed the missing leading slash
router.delete('/delete/:title', DeleteCheckListItem);

// Mark an item by title
router.post('/mark/:title', MarkCheckListItem);

export default router;
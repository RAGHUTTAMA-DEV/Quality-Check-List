import express from 'express';
import CheckListStage from '../models/CheckListStage.js';
import CheckListItem from '../models/CheckList.js';
import {
  PostCheckListItem,
  UpdateCheckListItem,
  GetAllCheckListItems,
  DeleteCheckListItem,
  MarkCheckListItem
} from '../controllers/CheckListStage.js';
import { auth,authorize } from '../middleware/authorize.js';

const router = express.Router();


router.post('/', PostCheckListItem);


router.put('/update/:title', UpdateCheckListItem);

router.get('/', GetAllCheckListItems);


router.delete('/delete/:title', DeleteCheckListItem);


router.post('/mark/:title', MarkCheckListItem);
router.get('/assigned', auth, authorize('operator', 'admin'), async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const assignedStages = await CheckListStage.find({ AssingedTo: userId })
      .populate('stage')
      .populate('items');
    
    res.status(200).json({ assignedStages, message: "Assigned stages fetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching assigned checklists" });
  }
});

router.get('/user-assignments', auth, authorize('operator', 'admin'), async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Get all assigned checklist stages
    const assignedStages = await CheckListStage.find({ AssingedTo: userId })
      .populate('stage')
      .populate('items');
    
    // Get all assigned checklist items
    const assignedItems = await CheckListItem.find({ AssingedTo: userId });
    
    res.status(200).json({ 
      assignedStages, 
      assignedItems,
      message: "All user assignments fetched" 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching user assignments" });
  }
});


export default router;
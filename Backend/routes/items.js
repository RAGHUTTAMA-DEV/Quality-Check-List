import express from 'express';
import {
  PostCheckListItem,
  UpdateCheckListItem,
  GetAllCheckListItems,
  DeleteCheckListItem,
  MarkCheckListItem
} from '../controllers/CheckListStage.js';

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

    const assignedStages = await CheckListStage.find({ AssignedTo: userId }) // 🔧 FIXED typo here
    if (!assignedStages) {
      return res.status(404).json({ message: "No stages found for the user" });
    }

    

    res.status(200).json({ stages: assignedStages, message: "Assigned stages fetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching assigned checklists" });
  }
});

export default router;
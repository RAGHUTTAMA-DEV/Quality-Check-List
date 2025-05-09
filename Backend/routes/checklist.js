import express from "express";
import { GetAllCheckList, GetCheckList, UpdateCheckList, DeleteCheckList, CreateCheckList } from "../controllers/ChecklistController.js";
import { authorize, auth } from "../middleware/authorize.js";
import CheckListStage from "../models/CheckListStage.js";
import CheckListItem from "../models/CheckList.js";
const router = express.Router();

router.get('/', auth, authorize('admin'), GetAllCheckList); // GET all
router.get('/find', auth, authorize('admin', 'supervisor'), GetCheckList); // GET single by content
router.post('/', auth, CreateCheckList); // CREATE
router.put('/', auth, authorize('admin', 'supervisor'), UpdateCheckList); // UPDATE by content
router.delete('/', auth, authorize('admin', 'supervisor'), DeleteCheckList); // DELETE by content
router.get('/assigned', auth, authorize('operator', 'admin'), async (req, res) => {
  try {
    const { userId } = req.query;

   if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
   }

    const assignedStages = await CheckListItem.find({ AssignedTo: userId });
    const stages = await CheckListItem.find(); // Renamed from `res` to `stages`

   // if (!assignedStages || assignedStages.length === 0) {
     // return res.status(404).json({ message: "No stages found for the user" });
    //}

    res.status(200).json({ stages, message: "Assigned stages fetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching assigned checklists" });
  }
});

export default router;

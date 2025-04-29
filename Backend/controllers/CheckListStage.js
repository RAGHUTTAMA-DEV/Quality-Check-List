import CheckListStage from "../models/CheckListStage.js";

export async function PostCheckListItem(req, res) {
  try {
    const { title, items, stage, description } = req.body;
    
    if (!title || !stage) {
      return res.status(400).json({ message: "Title and stage are required" });
    }

    const created = await CheckListStage.create({ 
      title, 
      items: items || [], 
      stage,
      description: description || ""
    });
    
    res.status(201).json({ message: "Checklist Item Created", created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function GetAllCheckListItems(req, res) {
  try {
    const allItems = await CheckListStage.find();
    res.status(200).json({ items: allItems, message: "Fetched successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function UpdateCheckListItem(req, res) {
  try {
    const { title } = req.params;
    const updateData = req.body;
    
    if (!title) {
      return res.status(400).json({ message: "Title parameter is required" });
    }

    const updated = await CheckListStage.findOneAndUpdate(
      { title },
      { $set: updateData },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.status(200).json({ updated, message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function DeleteCheckListItem(req, res) {
  try {
    const { title } = req.params;
    
    if (!title) {
      return res.status(400).json({ message: "Title parameter is required" });
    }

    const deleted = await CheckListStage.findOneAndDelete({ title });
    
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.status(200).json({ deleted, message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function MarkCheckListItem(req, res) {
  try {
    const { title } = req.params;
    const { mark } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: "Title parameter is required" });
    }

    if (mark === undefined) {
      return res.status(400).json({ message: "Mark value is required" });
    }

    const updated = await CheckListStage.findOneAndUpdate(
      { title },
      { $set: { mark } },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.status(200).json({ updated, message: "Marked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
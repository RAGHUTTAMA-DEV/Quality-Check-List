import CheckListModel from "../models/CheckList.js";

export async function CreateCheckList(req, res) {
  try {
    const { content, isChecked, comments, checkedBy, Image } = req.body;

    const newChecklist = await CheckListModel.create({
      content,
      isChecked,
      comments,
      checkedBy,
      Image,
    });

    res.status(201).json({ checklist: newChecklist, message: "Checklist Created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating checklist" });
  }
}

export async function GetAllCheckList(req, res) {
  try {
    const checklists = await CheckListModel.find();
    res.status(200).json({ checklists, message: "Checklists Found" });
    console.log(checklists);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching checklists" });
  }
}

export async function GetCheckList(req, res) {
  try {
    const { content } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Content query is required" });
    }

    const checklist = await CheckListModel.findOne({ content });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.status(200).json({ checklist, message: "Checklist Found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching checklist" });
  }
}

export async function UpdateCheckList(req, res) {
  try {
    const { content } = req.query;
    const updateData = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content query is required" });
    }

    const checklist = await CheckListModel.findOneAndUpdate(
      { content },
      { $set: updateData },
      { new: true }
    );

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.status(200).json({ checklist, message: "Checklist Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating checklist" });
  }
}

export async function DeleteCheckList(req, res) {
  try {
    const { content } = req.query;

    if (!content) {
      return res.status(400).json({ message: "Content query is required" });
    }

    const checklist = await CheckListModel.findOneAndDelete({ content });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.status(200).json({ checklist, message: "Checklist Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting checklist" });
  }
}

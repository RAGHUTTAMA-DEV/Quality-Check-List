import Tracker from "../models/Tracker.js";

export async function CreateLog(req, res) {
  try {
    const { message, action, name, stage } = req.body;
    await Tracker.create({ message, action, name, stage });
    res.status(201).json({ message: "Log Created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function GetAllLogs(req, res) {
  try {
    const logs = await Tracker.find();
    res.json({ logs, message: "Logs Fetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// FIX THIS ONE:
export async function GetLogs(req, res) {
  try {
    const { name } = req.params;  // <- Correct way
    const logs = await Tracker.find({ name }); // <- Correct query
    res.json({ logs, message: "Logs Found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

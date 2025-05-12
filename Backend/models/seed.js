import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Import models
import UserModel from "./UserSchema.js";
import ProductStageModel from "./ProductStage.js";
import CheckListItem from "./CheckList.js";
import CheckListStage from "./CheckListStage.js";
import Tracker from "./Tracker.js";

// Connect to DB
try {
  await mongoose.connect(process.env.MONGO_URL || "mongodb+srv://raghuttama03:samera2007@cluster0.sylhh.mongodb.net/CheckList", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to database");
} catch (error) {
  console.error("❌ Database connection error:", error);
  process.exit(1);
}

// Clear collections
try {
  await Promise.all([
    UserModel.deleteMany(),
    ProductStageModel.deleteMany(),
    CheckListItem.deleteMany(),
    CheckListStage.deleteMany(),
    Tracker.deleteMany()
  ]);
  console.log("✅ Database cleared");
} catch (error) {
  console.error("❌ Error clearing database:", error);
  process.exit(1);
}

// Seed Users
try {
  const users = await UserModel.insertMany([
    { 
      username: "admin_user", 
      email: "admin@example.com", 
      password: "hashedpass1", 
      role: "admin" 
    },
    { 
      username: "operator_one", 
      email: "operator1@example.com", 
      password: "hashedpass2", 
      role: "operator" 
    },
    { 
      username: "operator_two", 
      email: "operator2@example.com", 
      password: "hashedpass3", 
      role: "operator" 
    },
    { 
      username: "supervisor_one", 
      email: "supervisor1@example.com", 
      password: "hashedpass4", 
      role: "supervisior" 
    },
    { 
      username: "operator_three", 
      email: "operator3@example.com", 
      password: "hashedpass5", 
      role: "operator" 
    },
    { 
      username: "supervisor_two", 
      email: "supervisor2@example.com", 
      password: "hashedpass6", 
      role: "supervisior" 
    }
  ]);
  console.log("✅ Users seeded successfully");

  // Seed Product Stages
  const stages = await ProductStageModel.insertMany([
    { 
      name: "Initial Inspection", 
      description: "First inspection of raw materials", 
      status: "pending",
      assignedTo: users[1]._id 
    },
    { 
      name: "Assembly Line", 
      description: "Product assembly process", 
      status: "inProgress",
      assignedTo: users[2]._id,
      statedAt: new Date() 
    },
    { 
      name: "Quality Check", 
      description: "Final quality assurance", 
      status: "completed",
      assignedTo: users[3]._id,
      statedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endedAt: new Date() 
    },
    { 
      name: "Packaging", 
      description: "Product packaging for shipping", 
      status: "pending",
      assignedTo: users[4]._id 
    },
    { 
      name: "Final Inspection", 
      description: "Last inspection before shipping", 
      status: "pending",
      assignedTo: users[5]._id 
    }
  ]);
  console.log("✅ Product Stages seeded successfully");

  // Seed CheckList Items
  const checklistItems = await CheckListItem.insertMany([
    {
      content: "Inspect raw material quality",
      isChecked: false,
      AssingedTo: users[1]._id
    },
    {
      content: "Verify material dimensions",
      isChecked: true,
      checkedBy: users[1]._id,
      coments: "All dimensions within tolerance",
      AssingedTo: users[1]._id
    },
    {
      content: "Check component alignment",
      isChecked: true,
      checkedBy: users[2]._id,
      AssingedTo: users[2]._id
    },
    {
      content: "Ensure screw tightness",
      isChecked: true,
      checkedBy: users[2]._id,
      AssingedTo: users[2]._id
    },
    {
      content: "Verify electrical connections",
      isChecked: false,
      AssingedTo: users[2]._id
    },
    {
      content: "Test functionality",
      isChecked: true,
      checkedBy: users[3]._id,
      coments: "Passed all functional tests",
      AssingedTo: users[3]._id
    },
    {
      content: "Inspect surface finish",
      isChecked: true,
      checkedBy: users[3]._id,
      AssingedTo: users[3]._id
    },
    {
      content: "Verify product labeling",
      isChecked: false,
      AssingedTo: users[4]._id
    }
  ]);
  console.log("✅ CheckList Items seeded successfully");

  // Seed CheckList Stages
  const checklistStages = await CheckListStage.insertMany([
    {
      title: "Raw Materials Inspection",
      stage: stages[0]._id,
      items: [checklistItems[0]._id, checklistItems[1]._id],
      AssingedTo: users[1]._id
    },
    {
      title: "Assembly Process Checklist",
      stage: stages[1]._id,
      items: [checklistItems[2]._id, checklistItems[3]._id, checklistItems[4]._id],
      AssingedTo: users[2]._id
    },
    {
      title: "Quality Assurance Checklist",
      stage: stages[2]._id,
      items: [checklistItems[5]._id, checklistItems[6]._id],
      AssingedTo: users[3]._id
    },
    {
      title: "Packaging Checklist",
      stage: stages[3]._id,
      items: [checklistItems[7]._id],
      AssingedTo: users[4]._id
    }
  ]);
  console.log("✅ CheckList Stages seeded successfully");

  // Seed Tracker Logs
  await Tracker.insertMany([
    {
      name: users[1].username,
      action: "Verified",
      message: "Verified material dimensions",
      stage: stages[0]._id
    },
    {
      name: users[2].username,
      action: "Completed",
      message: "Completed component alignment check",
      stage: stages[1]._id
    },
    {
      name: users[2].username,
      action: "Completed",
      message: "Ensured proper screw tightness",
      stage: stages[1]._id
    },
    {
      name: users[3].username,
      action: "Tested",
      message: "Successfully tested product functionality",
      stage: stages[2]._id
    },
    {
      name: users[3].username,
      action: "Inspected",
      message: "Inspected and approved surface finish",
      stage: stages[2]._id
    }
  ]);
  console.log("✅ Tracker logs seeded successfully");

  console.log("✅ All seed data inserted successfully");
} catch (error) {
  console.error("❌ Error seeding data:", error);
  console.error(error.stack);
}

// Close connection
await mongoose.connection.close();
console.log("✅ Database connection closed");
process.exit(0);
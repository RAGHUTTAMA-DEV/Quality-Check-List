import mongoose from "mongoose";


async function ConnectDb() {
  try {
    const dbURl='mongodb+srv://raghuttama03:samera2007@cluster0.sylhh.mongodb.net/CheckList'
    await mongoose.connect(dbURl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database Connected Successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit the process if DB connection fails
  }
}

export default ConnectDb;

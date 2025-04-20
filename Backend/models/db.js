import mongoose from "mongoose";


async function ConnectDb(){
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connectedon nothin");  
}

export default ConnectDb;   
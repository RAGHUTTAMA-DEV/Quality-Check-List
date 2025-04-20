import mongoose from "mongoose";


async function ConnectDb(){
    await mongoose.connect(process.env.MONGO_URL);
<<<<<<< HEAD
    console.log("Database Connected");  
=======
    console.log("Database Connectedon");  
>>>>>>> master
}

export default ConnectDb;   
import ConnectDb from "./models/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";


const app=express();

app.use(express.json());
app.use(cors());    
dotenv.config();
app.use("/api/auth",authRouter);
app.use('/api/users',usersRouter);

async function main(){
    await ConnectDb();
    app.listen(process.env.PORT,()=>{
        console.log("Server Started");
    })
}

main();
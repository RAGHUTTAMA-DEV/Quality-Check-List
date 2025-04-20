import ConnectDb from "./models/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";


const app=express();

app.use(express.json());
app.use(cors());    
dotenv.config();
app.use("/api/auth",authRouter);

async function main(){
    await ConnectDb();
    app.listen(process.env.PORT,()=>{
        console.log("Server Started");
    })
}

main();
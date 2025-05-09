import ConnectDb from "./models/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import { authorize } from "./middleware/authorize.js";
import stagesRouter from "./routes/stages.js";
import checkListRouter from "./routes/checklist.js";
import logsRouter from "./routes/logs.js";
import itemsRouter from "./routes/items.js";

const app=express();

app.use(express.json());
app.use(cors());    
dotenv.config();
app.use("/api/auth",authRouter);
app.use('/api/users',usersRouter);
app.use('/api/stages',stagesRouter);
app.use('/api/checklist',checkListRouter);
app.use('/api/logs',logsRouter);
app.use('/api/items',itemsRouter);

const PORT=process.env.PORT || 5000;

async function main(){
    await ConnectDb();
    app.listen(PORT,()=>{
        console.log("Server Started on port 5000");
    })
}

main();
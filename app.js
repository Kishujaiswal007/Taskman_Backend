import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userroutes from './src/routes/authroutes.js';
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin: "https://taskmanagementsy.netlify.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,  
  }));
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
dotenv.config();

app.get("/",(req,res)=>{
    res.send("hellow world");
})

app.use("/",userroutes);

export default app;


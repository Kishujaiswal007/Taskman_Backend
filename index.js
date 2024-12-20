import app from "./app.js";
import connectDB from "./src/config/database.js";
import dotenv from "dotenv";

dotenv.config();

const startserver=async()=>{

    try{
        await connectDB();
        const port=process.env.PORT;
        app.listen(port || 3000,()=>console.log(`server is running on port ${process.env.PORT}`));
    }
    catch(err){
        console.log(err);
    }
}
startserver();
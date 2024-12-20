import jwt from "jsonwebtoken"
import User from "../models/user.js";
const jwtVerify=async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            return res.status(301).json(message,"Unauthorized access");
        }
        const decodedtoken=jwt.verify(token,process.env.JWT_ACCESS_SECRET);
        const user=await User.findById(decodedtoken.userId).select("-password");
        if(!user){
            throw new Error("Unauthorized user");
        }
        req.user=user;
        next();
    } catch (error) {
        console.log(error,"Authorization failed");
    }
}
export {jwtVerify};
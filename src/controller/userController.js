import {emailValidation,passwordValidation} from "../validation/userValidation.js";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateUserTokens=(user)=>{
    try {
        const accessToken=jwt.sign({email:user.email,userId:user._id},process.env.JWT_ACCESS_SECRET,{expiresIn:process.env.ACCESS_EXPIRY_TIME});
        const refreshToken=jwt.sign({email:user.email,userId:user._id},process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.REFRESH_EXPIRY_TIME});
        return {accessToken,refreshToken};
    } catch (error) {
     console.log(error,"token generation failed");   
    }
}

const registeredUsers=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const isemailvalid=emailValidation(email);
        if(!isemailvalid){
            return res.status(400).json({message:"email is not valid"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exist"});
        }
        const ispasswordvalid=passwordValidation(password);
        if(!ispasswordvalid){
            return res.status(400).json({message:"password is not valid"});
        }
         const newuser=new User({email,password});
      const saveduser=await  newuser.save();
        res.status(200).json({message:"user registered successfully"});
    } catch (error) {
        return res.status(300).json({message:"user not registered"});
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const ispasswordvalid=await bcryptjs.compare(password,user.password);
        if(!ispasswordvalid){
            return res.status(400).json({message:"password is not valid"});
        }
        const {accessToken,refreshToken}=generateUserTokens(user);
        user.refreshtoken=refreshToken;
        await user.save();
        res.cookie("accessToken",accessToken);
        res.cookie("refreshToken",refreshToken);
        return res.status(200).json({
            message: "User logged in successfully",
            accessToken,
            refreshToken
        });
            } catch (error) {
        console.log("user not logged in");
        
    }
}

const generateAccessTokens=async(req,res)=>{
    const token=req.cookies?.refreshToken || req.header("Authorization")?.replace("Beares ","");
    if(!token){
        return res.status(301).json({message:"Unauthorized access"});
    }
    const decodetoken=jwt.verify(token,process.env.JWT_REFRESH_SECRET);
    if(!decodetoken){
        return res.status(400).json(message,"Unauthorized access");
    }
    const user={_id:decodetoken.userId,email:decodetoken.email};
    const {accessToken,refreshToken}=generateUserTokens(user);
    const newuser=await User.findOne({email:user.email});
    newuser.refreshtoken=refreshToken;
    await newuser.save();
    const options={
        httpOnly:true,
        secure:true,
    }
    res.cookie("accessToken",accessToken,options);
    res.cookie("refreshToken",refreshToken,options);
    return res.status(200).json({message:"user logged in successfully"});
}

const logoutUser=async(req,res)=>{
    const {email}=req.user;
    try {
        const user=await User.findOneAndUpdate({email},{refreshtoken:null});
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({message:"user logged out successfully"});
    } catch (error) {
        console.log("user not logged out");
        return res.status(400).json({message:"user not logged out"});
        
    }
}
export {registeredUsers,loginUser,logoutUser,generateAccessTokens};
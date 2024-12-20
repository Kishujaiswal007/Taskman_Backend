import { Router } from "express";
import { registeredUsers,loginUser,logoutUser ,generateAccessTokens} from "../controller/userController.js";
import User from "../models/user.js";
import {addtask} from "../controller/taskController.js";
import { fetchdashboard, gettask, update,deleteTask } from "../services/taskService.js";
import {jwtVerify} from "../middleware/authmiddleware.js";

const userroutes=Router();
userroutes.route("/login").post(loginUser);
userroutes.route("/register").post(registeredUsers);
userroutes.route("/logout").get(jwtVerify,logoutUser);
userroutes.route("/refreshlogin").get(generateAccessTokens);

userroutes.route("/addtask").post(jwtVerify,addtask);
userroutes.route("/dashboard").get(jwtVerify,fetchdashboard);
userroutes.route("/gettask").get(jwtVerify,gettask);
userroutes.route("/update").post(jwtVerify,update);
userroutes.route("/deleteTask").delete(jwtVerify,deleteTask);

export default userroutes;
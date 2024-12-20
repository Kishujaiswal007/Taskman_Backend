
import Task from "../models/task.js";
const addtask=async(req,res)=>{
    const task=req.body;
    console.log(task);
    console.log(req.body);
    if(!task){
        return res.status(400).json({message:"task is required"});
    }
    const newtask=new Task({title:task.title,
        startTime:task.startTime,
        endTime:task.endTime,
        priority:task.priority,
        status:task?.status,
        userId:req.user._id})
    await newtask.save();
    return res.status(200).json({message:"task added successfully"});
}
export {addtask};  
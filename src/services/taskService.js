import Task from "../models/task.js";


const fetchdashboard=async(req,res)=>{
    const userId = req.user._id;
    try {
        const stats = await Task.aggregate([
            { $match: { userId: req.user._id } },
            {
              $facet: {
                totalTasks: [{ $count: 'count' }],
                completedTasks: [{ $match: { status: 'finished' } }, { $count: 'count' }],
                pendingTasks: [{ $match: { status: 'pending' } }, { $count: 'count' }],
                avgCompletionTime: [
                  { $match: { status: 'finished' } },
                  {
                    $group: {
                      _id: null,
                      avgTime: {
                        $avg: {
                          $divide: [
                            { $subtract: ['$endTime', '$startTime'] },
                            3600000, 
                          ],
                        },
                      },
                    },
                  },
                ],
                pendingStats: [
                  { $match: { status: 'pending' } },
                  {
                    $group: {
                      _id: '$priority',
                      count: { $sum: 1 },
                      totalTimeLapsed: {
                        $sum: {
                          $divide: [{ $subtract: [new Date(), '$startTime'] }, 3600000],
                        },
                      },
                      totalTimeLeft: {
                        $sum: {
                          $cond: [
                            { $gte: [new Date(), '$endTime'] },
                            0,
                            {
                              $divide: [{ $subtract: ['$endTime', new Date()] }, 3600000],
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
                dashboardstats: [
                  { $match: { userId: req.user._id } },
                  {
                    $group: {
                      _id: '$priority',
                      count: { $sum: 1 },
                      totalTimeLapsed: {
                        $sum: {
                          $cond: [
                            { $gte: ['$startTime',new Date()] },
                            0,
                            {
                              $divide: [{ $subtract: [new Date(),'$startTime'] }, 3600000],
                            }
                          ],
                        },
                      },
                      totalTimeLeft: {
                        $sum: {
                          $cond: [
                            { $gte: [new Date(), '$endTime'] },
                            0,
                            {
                              $divide: [{ $subtract: ['$endTime', new Date()] }, 3600000],
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          ]);

          const totalTasks = stats[0].totalTasks[0]?.count || 0;
    const completedTasks = stats[0].completedTasks[0]?.count || 0;
    const pendingTasks = stats[0].pendingTasks[0]?.count || 0;
    const avgCompletionTime = stats[0].avgCompletionTime[0]?.avgTime.toFixed(2) || '0.00';
    const pendingStats = stats[0].pendingStats.reduce(
      (acc, stat) => {
        acc.priorityStats[stat._id] = {
          count: stat.count,
          timeLapsed: stat.totalTimeLapsed.toFixed(2),
          timeLeft: stat.totalTimeLeft.toFixed(2),
        };
        acc.timeLapsed += stat.totalTimeLapsed;
        acc.timeLeft += stat.totalTimeLeft;
        return acc;
      },
      { timeLapsed: 0, timeLeft: 0, priorityStats: {} }
    );
    const timeLapsed = pendingStats.timeLapsed.toFixed(2);
    const timeLeft = pendingStats.timeLeft.toFixed(2);
    const priorityStats = pendingStats.priorityStats;


    return res.status(200).json({
      totalTasks,
      completedPercent: ((completedTasks / totalTasks) * 100).toFixed(2),
      pendingPercent: ((pendingTasks / totalTasks) * 100).toFixed(2),
      avgCompletionTime,
      pendingTasks,
      timeLapsed: pendingStats.timeLapsed.toFixed(2),
      timeLeft: pendingStats.timeLeft.toFixed(2),
      priorityStats: pendingStats.priorityStats,
      dashboardstats: stats[0].dashboardstats
    });



        
    } catch (error) {
     console.log(error,"total tasks aggregation failed");   
    }
}

const gettask=async(req,res)=>{
    const userId = req.user._id;
    try {
        const tasks = await Task.find({ userId });
        return res.status(200).json(tasks);
      } catch (error) {
        console.log(error,"total tasks aggregation failed");
      }
}

const update=async(req,res)=>{
    const taskId = req.body.taskId;
    console.log(taskId);
    try {
        const { priority, endTime, status } = req.body.formData;
        
        console.log(priority, endTime, status);
        const object={};
        if(priority) object.priority=priority;
        if(endTime) object.endTime=endTime;
        if(status) object.status=status;
        const updatedtask = await Task.findByIdAndUpdate(
            taskId ,
            object,
            { new: true, runValidators: true }
          );
        await updatedtask.save();
        return res.status(200).json({ message: 'Task status updated successfully' });
      } catch (error) {
        console.log(error," tasks update failed");
      }
}

const deleteTask=async(req,res)=>{
  try {
    
    const task=await Task.findByIdAndDelete(req.body.taskIds);
    return res.status(200).json({message:"tasks deleted successfully"});
    
  } catch (error) {
    console.log(error," tasks deleation failed");
  }
}


  

export {fetchdashboard,gettask,update,deleteTask};
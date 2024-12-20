import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User',
      required: true 
    },
  title: { 
    type: String,
     required: true
     },
  startTime: { 
    type: Date, 
    required: true
 },
  endTime: {
     type: Date,
     },
  priority: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5
 },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'finished'] ,
    default: 'pending'
},
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
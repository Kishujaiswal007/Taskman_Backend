import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true },
  password: { 
    type: String, 
    required: true ,
    min: 6, 
    max: 1024 
},
refreshtoken: { 
    type: String 
}
},{ timestamps: true });

userSchema.pre("save",async function(next){
  if(!this.isModified("password"))
  return next();
this.password=await bcryptjs.hash(this.password,10);
next();
})

const User = mongoose.model('User', userSchema);
export default User;
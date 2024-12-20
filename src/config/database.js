import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if(conn){
        console.log(conn.connection.host);
    }
    else
    console.log('MongoDB not Connected');
  } catch (err) {
    console.error(err.message);
    throw new Error('MongoDB not Connected');
  }
};

export default connectDB;
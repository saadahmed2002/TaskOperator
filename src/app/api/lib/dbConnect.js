import mongoose from 'mongoose';
import config from '../config/config';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(config.MONGODB_URI);
};

export default dbConnect;

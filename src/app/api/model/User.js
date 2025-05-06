import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manager', 'member'],
    default: 'member',
  },
  designation: {
    type: String,
    required: true,
  },
  notifications: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

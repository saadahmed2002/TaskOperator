import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate UUIDs
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email should be unique
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
    type: [String], // Or use a schema if more complex notifications
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

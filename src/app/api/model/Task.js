const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
 
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  assignedDate: { type: Date },
  priority: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: String, unique: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

// Use mongoose.models to avoid overwriting the model if it already exists
module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);

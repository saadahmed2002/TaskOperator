import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import mongoose from 'mongoose';

export async function assignedToTask(req, userId) {
  await dbConnect();

  try {
 

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ message: 'Invalid user ID' }), { status: 400 });
    }

    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name email');

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (err) {
    console.error('Task fetch error:', err);
    return new Response(JSON.stringify({ message: 'Error fetching tasks' }), { status: 500 });
  }
}

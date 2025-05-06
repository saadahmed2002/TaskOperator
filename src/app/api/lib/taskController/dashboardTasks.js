import dbConnect from '../dbConnect';
import Task from '../../model/Task';

export const dashboardTasks = async (req) => {
  await dbConnect();

  try {
    const tasks = await Task.find({ status: 'Pending' })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate('assignedTo', 'name');

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (err) {
    console.error('Failed to load dashboard tasks:', err);
    return new Response(JSON.stringify({ error: 'Could not fetch tasks' }), { status: 500 });
  }
};

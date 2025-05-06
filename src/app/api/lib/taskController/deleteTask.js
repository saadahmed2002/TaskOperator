import dbConnect from '../dbConnect';
import Task from '../../model/Task';

export async function deleteTask(req, { params }) {
  const { taskId } = params;

  await dbConnect();

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return new Response(JSON.stringify({ message: 'Task not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), { status: 200 });
  } catch (err) {
    console.error('Failed to delete task:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

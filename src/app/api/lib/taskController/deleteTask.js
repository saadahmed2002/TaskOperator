import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';

export async function deleteTask(req, { params }) {
  const { taskId } =await params;

  await dbConnect();

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

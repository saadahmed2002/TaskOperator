import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';

export async function markTaskAsFailed(req, { params }) {
  const { taskId } =await params;

  await dbConnect();

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    task.status = 'Failed';
    await task.save();
    return NextResponse.json({ message: 'Task marked as falied', task });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ message: 'Server error while updating task' }, { status: 500 });
  }
}

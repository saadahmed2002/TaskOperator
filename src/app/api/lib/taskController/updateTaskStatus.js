import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';

export async function updateTaskStatus(req, { params }) {
  const { taskId } = await params;
  const { status } = await req.json();

  await dbConnect();

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

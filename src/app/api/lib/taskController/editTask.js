import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';

export async function editTask(req, { params }) {
  const { taskId } = params;
  const updatedData = await req.json();

  await dbConnect();

  try {
    const task = await Task.findOneAndUpdate({ _id: taskId }, updatedData, { new: true });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (err) {
    console.error('Failed to update task:', err);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

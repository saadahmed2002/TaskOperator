import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function assignedToTask(req, { params }) {
  await dbConnect()
  try {
    const { userId } =await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' });
    }

    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name email');
     
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching tasks' });
  }
}

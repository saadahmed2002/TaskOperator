import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';

export const getAllTasks = async (req) => {
  await dbConnect();
  console.log("I am called")

  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name');

    const validTasks = tasks.filter(
      task => task.assignedTo && task.assignedBy
    );



    return NextResponse.json(validTasks, { status: 200 });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

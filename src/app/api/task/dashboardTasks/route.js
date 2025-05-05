import dashboardTasks  from '../../lib/taskController/updateTaskStatus'
import dbConnect from '../../lib/dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';
export async function GET(req, res) {
  await dbConnect();


  try {
    const tasks = await Task.find({ status: 'Pending' })
      .limit(5)
      .sort({ dueDate: 1 })
      .populate('assignedTo', 'name');

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching dashboard tasks:', error);
    return NextResponse.json({ error: 'Server error while fetching tasks' }, { status: 500 });
  }
  
}
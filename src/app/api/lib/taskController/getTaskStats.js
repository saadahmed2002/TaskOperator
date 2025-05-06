import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';

export async function getTaskStats(req, userId) {


  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    await Task.updateMany(
      {
        assignedTo: userId,
        status: 'Pending',
        dueDate: { $lt: new Date() },
      },
      { $set: { status: 'Failed' } }
    );

    const [assigned, completed, pending, failed] = await Promise.all([
      Task.countDocuments({ assignedTo: userId }),
      Task.countDocuments({ assignedTo: userId, status: 'Completed' }),
      Task.countDocuments({ assignedTo: userId, status: 'Pending' }),
      Task.countDocuments({ assignedTo: userId, status: 'Failed' }),
    ]);

    return NextResponse.json({ assigned, completed, pending, failed });
  } catch (err) {
    console.error('Error fetching task stats:', err);
    return NextResponse.json({ message: 'Error fetching task stats' }, { status: 500 });
  }
}

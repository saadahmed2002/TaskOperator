import dbConnect from '../dbConnect';
import Task from '../../model/Task';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function createTask(req) {
  await dbConnect();
  

  const { title, description, dueDate, assignedDate, priority, assignedTo, assignedBy } = await req.json();

  if (!title || !description || !dueDate || !assignedTo || !assignedBy) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newid = uuidv4()
   
    const newTask = new Task({  taskId: newid,title, description, dueDate, assignedDate, priority, assignedTo, assignedBy });
    const savedTask = await newTask.save();
    return NextResponse.json(savedTask, { status: 201 });
  } catch (err) {
    console.error('Error creating task:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

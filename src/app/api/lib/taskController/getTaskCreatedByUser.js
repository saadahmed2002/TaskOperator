const { NextResponse } = require("next/server");
const Task = require("../../model/Task");
const { default: dbConnect } = require("../dbConnect");


export const getTasksCreatedByUser = async (req,{params}) => {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' });
    }

    const tasks = await Task.find({ assignedBy: userId }).populate('assignedTo', 'name');

    // Always return an array
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Server error' });
  }
};
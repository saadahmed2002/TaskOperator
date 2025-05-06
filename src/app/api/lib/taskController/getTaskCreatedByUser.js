const { NextResponse } = require("next/server");
const Task = require("../../model/Task");


export const getTasksCreatedByUser = async (req,  userId ) => {
  try {
    

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ assignedBy: userId }).populate('assignedTo', 'name');
    console.log(tasks)

    if (tasks.length === 0) {
      return NextResponse.json(
        { message: 'No tasks found for the specified user' },
        { status: 404 }
      );
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

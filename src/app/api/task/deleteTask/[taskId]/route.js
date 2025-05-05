import { deleteTask } from '../../../lib/taskController/deleteTask'
import dbConnect from '../../../lib/dbConnect';

export async function DELETE(req, { params }) {
  await dbConnect();
  return deleteTask(req, { params });
}
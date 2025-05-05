import { editTask } from '../../../lib/taskController/editTask'
import dbConnect from '../../../lib/dbConnect';
export async function PUT(req, { params }) {
  await dbConnect();
  return editTask(req, { params });
}
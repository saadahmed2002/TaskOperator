import { deleteTask } from '../../../lib/taskController/deleteTask'
import dbConnect from '../../../lib/dbConnect';
import { verifyToken } from '@/app/api/middleware/middleware';

export async function DELETE(req, { params }) {
  await dbConnect();
  return verifyToken( deleteTask(req, { params }))
}
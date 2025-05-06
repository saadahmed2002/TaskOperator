import { editTask } from '../../../lib/taskController/editTask'
import dbConnect from '../../../lib/dbConnect';
import { verifyToken } from '@/app/api/middleware/middleware';
export async function PUT(req, { params }) {
  await dbConnect();
  return verifyToken( editTask(req, { params }))
}

import { assignedToTask } from '../../../lib/taskController/assignedToTask';
import dbConnect from '../../../lib/dbConnect';
import { verifyToken } from '@/app/api/middleware/middleware';


export async function GET(req, { params }) {
  const {userId} = await params
  await dbConnect();
  return verifyToken(assignedToTask(req, userId));
}
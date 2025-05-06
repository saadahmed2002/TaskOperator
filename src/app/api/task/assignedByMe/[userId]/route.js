
import { getTasksCreatedByUser } from '@/app/api/lib/taskController/getTaskCreatedByUser';
import dbConnect from '../../../lib/dbConnect';
import { verifyToken } from '@/app/api/middleware/middleware';

export async function GET(req, { params }) {
const {userId} = await params
  await dbConnect();
  return verifyToken( getTasksCreatedByUser(req,  userId) );
}
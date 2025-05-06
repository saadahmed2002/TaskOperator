
import { getTasksCreatedByUser } from '@/app/api/lib/taskController/getTaskCreatedByUser';
import dbConnect from '../../../lib/dbConnect';

export async function GET(req, { params }) {
const {userId} = await params
  await dbConnect();
  return getTasksCreatedByUser(req,  userId );
}
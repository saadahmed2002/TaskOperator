
import { markTaskAsCompleted } from '../../../lib/taskController/markTaskAsCompleted';
import dbConnect from '../../../lib/dbConnect';
import { verifyToken } from '@/app/api/middleware/middleware';

export async function PATCH(req, { params }) {
  await dbConnect();
  
  return vefifyToken(markTaskAsCompleted(req, { params }));
}
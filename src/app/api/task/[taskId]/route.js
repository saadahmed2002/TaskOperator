import {updateTaskStatus} from '../../lib/taskController/updateTaskStatus'
import dbConnect from '../../lib/dbConnect';
import { verifyToken } from '../../middleware/middleware';

export async function PATCH(req, { params }) {
  await dbConnect();
  return verifyToken(updateTaskStatus(req, { params }));
}
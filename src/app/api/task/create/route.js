
import dbConnect from '../../lib/dbConnect';
import { createTask } from '../../lib/taskController/createTask';
import { verifyToken } from '../../middleware/middleware';


export async function POST(req) {
  await dbConnect();
  return verifyToken( createTask(req));
}
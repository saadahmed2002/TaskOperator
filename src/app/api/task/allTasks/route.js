
import dbConnect from '../../lib/dbConnect';
import { getAllTasks } from '../../lib/taskController/getAllTasks';
import { verifyToken } from '../../middleware/middleware';


export async function GET(req) {
  await dbConnect();
  return verifyToken( getAllTasks(req));
}
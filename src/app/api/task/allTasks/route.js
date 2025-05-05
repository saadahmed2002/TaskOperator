
import dbConnect from '../../lib/dbConnect';
import { getAllTasks } from '../../lib/taskController/getAllTasks';


export async function GET(req) {
  await dbConnect();
  return getAllTasks(req);
}
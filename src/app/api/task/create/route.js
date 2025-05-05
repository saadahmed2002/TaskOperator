
import dbConnect from '../../lib/dbConnect';
import { createTask } from '../../lib/taskController/createTask';


export async function POST(req) {
  await dbConnect();
  return createTask(req);
}
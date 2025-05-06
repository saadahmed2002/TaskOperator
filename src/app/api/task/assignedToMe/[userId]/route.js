
import { assignedToTask } from '../../../lib/taskController/assignedToTask';
import dbConnect from '../../../lib/dbConnect';

export async function GET(req, { params }) {
  await dbConnect();
  return verifyToken(assignedToTask(req, { params }));
}
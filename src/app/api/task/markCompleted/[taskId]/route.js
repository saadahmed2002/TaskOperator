
import { markTaskAsCompleted } from '../../../lib/taskController/markTaskAsCompleted';
import dbConnect from '../../../lib/dbConnect';

export async function PATCH(req, { params }) {
  await dbConnect();
  return markTaskAsCompleted(req, { params });
}
import {updateTaskStatus} from '../../lib/taskController/updateTaskStatus'
import dbConnect from '../../lib/dbConnect';

export async function PATCH(req, { params }) {
  await dbConnect();
  return updateTaskStatus(req, { params });
}
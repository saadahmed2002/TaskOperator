import dbConnect from "../../../lib/dbConnect";
import { markTaskAsFailed } from "../../../lib/taskController/markTaskAsFailed";


export async function PATCH(req, { params }) {
  await dbConnect();
  return markTaskAsFailed(req, { params });
}

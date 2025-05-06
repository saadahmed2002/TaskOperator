import { verifyToken } from "@/app/api/middleware/middleware";
import dbConnect from "../../../lib/dbConnect";
import { markTaskAsFailed } from "../../../lib/taskController/markTaskAsFailed";


export async function PATCH(req, { params }) {
  await dbConnect();
  return  verifyToken(markTaskAsFailed(req, { params }));
}

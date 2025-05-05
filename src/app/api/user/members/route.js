import dbConnect from "../../lib/dbConnect";
import { getAllUsers } from "../../lib/userController/userController";

export async function GET(req, res) {
    await dbConnect()
   return  await getAllUsers();}
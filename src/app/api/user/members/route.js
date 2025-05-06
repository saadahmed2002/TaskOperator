import { NextResponse } from "next/server";
import dbConnect from "../../lib/dbConnect";
import { getAllUsers } from "../../lib/userController/userController";
import { verifyToken } from "../../middleware/middleware";



export async function GET(req) {
  await dbConnect();
  return await verifyToken(getAllUsers(req))
}

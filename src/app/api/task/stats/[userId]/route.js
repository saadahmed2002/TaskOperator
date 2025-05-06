
import { getTaskStats } from '@/app/api/lib/taskController/getTaskStats';
import dbConnect from '../../../lib/dbConnect';
import { verifyToken } from '@/app/api/middleware/middleware';


export async function GET(req, { params }) {
  const { userId }= await params
 
  return verifyToken( getTaskStats(req,userId));
}

import { getTaskStats } from '@/app/api/lib/taskController/getTaskStats';
import dbConnect from '../../../lib/dbConnect';


export async function GET(req, { params }) {
  const { userId }= await params
 
  return getTaskStats(req,userId);
}
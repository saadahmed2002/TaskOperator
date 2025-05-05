import { getTeamMembers } from '@/lib/controller/userController';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const response = await getTeamMembers();
    return res.status(response.status).json(response.message || response.data);
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}


// Example of correct import if files are in src/lib/
// dbConnect
import dbConnect from '../lib/dbConnect';
import { getTeamMembers } from '../lib/userController/userController';

getTeamMembers

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const response = await getTeamMembers();
    return res.status(response.status).json(response.message || response.data);
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

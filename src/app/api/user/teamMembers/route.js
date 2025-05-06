import { NextResponse } from 'next/server';  // Importing NextResponse
import dbConnect from '../../lib/dbConnect';
import { getTeamMembers } from '../../lib/userController/userController';
export async function GET(req) {
  // Connect to the database
  await dbConnect();
  return await getTeamMembers(req)
}

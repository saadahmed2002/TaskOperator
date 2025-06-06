import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../model/User';
import dbConnect from '../../../lib/dbConnect';
import { deleteUser } from '../../../lib/userController/userController';
import { verifyToken } from '@/app/api/middleware/middleware';

export  async function GET(req, {params }) {
  const { userId } = await params;  
  if (!userId) {
    return NextResponse.json({ status: 400, message: 'User ID is required' });
  }

  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ status: 400, message: 'Invalid User ID format' });
  }

  try {
    const user = await User.findById(userId).populate('name'); 
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }
    
    return verifyToken( NextResponse.json({ status: 200, member: user }));
  } catch (err) {
    console.error('Error fetching user details:', err);
    return verifyToken(NextResponse.json({ status: 500, message: 'Server error' }));
  }
};

export async function DELETE(req, {params}) {
    const {userId} = await params

    return verifyToken(deleteUser(userId))
    
}
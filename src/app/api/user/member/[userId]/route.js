import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../model/User';
import dbConnect from '../../../lib/dbConnect';
import { deleteUser } from '../../../lib/userController/userController';

export  async function GET(req, {params }) {
  const { userId } = await params;  // Extract userId from the query

  if (!userId) {
    return NextResponse.json({ status: 400, message: 'User ID is required' });
  }

  console.log("USER ID", userId);
  await dbConnect();

  // Validate if userId is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ status: 400, message: 'Invalid User ID format' });
  }

  try {
    const user = await User.findById(userId).populate('name');  // Query the database using the valid userId
    
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }
    
    return NextResponse.json({ status: 200, member: user });
  } catch (err) {
    console.error('Error fetching user details:', err);
    return NextResponse.json({ status: 500, message: 'Server error' });
  }
};

export async function DELETE(req, {params}) {
    const {userId} = await params
    console.log(userId)
    return deleteUser(userId)
    
}
import dbConnect from '../../lib/dbConnect'
import User from '../../model/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import { NextResponse } from 'next/server';



export async function GET(req) {
  await dbConnect();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error('Fetch current user error:', err);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}

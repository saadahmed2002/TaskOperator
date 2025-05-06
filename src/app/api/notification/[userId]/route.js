
import dbConnect from '../../lib/dbConnect';
import { verifyToken } from '../../middleware/middleware';
import Notification from '../../model/Notification';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { userId } = await params;
    const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });

    return verifyToken( NextResponse.json(notifications, { status: 200 }))
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return verifyToken( NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 }))
  }
}

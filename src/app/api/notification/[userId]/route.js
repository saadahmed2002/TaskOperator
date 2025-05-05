// app/api/notifications/[userId]/route.js

import dbConnect from '../../lib/dbConnect';
import Notification from '../../model/Notification';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { userId } = await params;
    const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 });
  }
}

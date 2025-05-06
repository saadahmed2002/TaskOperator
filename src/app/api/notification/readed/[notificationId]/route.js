
import dbConnect from '@/app/api/lib/dbConnect';
import Notification from '@/app/api/model/Notification';

import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const { notificationId } =await params;

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Notification marked as read', notification: updatedNotification },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ message: 'Failed to mark notification as read' }, { status: 500 });
  }
}

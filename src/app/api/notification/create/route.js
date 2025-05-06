
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Notification from '../../model/Notification';
import { verifyToken } from '../../middleware/middleware';

export async function POST(req) {
  await dbConnect();

  try {
    const { recipientId, message, taskId, type } = await req.json();

    const newNotification = new Notification({
      recipientId,
      message,
      taskId,
      type,
      read: false,
    });
    console.log(newNotification)

    await newNotification.save();

    return verifyToken( NextResponse.json(
      { message: 'Notification created successfully', notification: newNotification },
      { status: 200 }
    ))
  } catch (error) {
    console.error('Error creating notification:', error);
    return verifyToken( NextResponse.json({ message: 'Failed to create notification' }, { status: 500 }))
  }
}

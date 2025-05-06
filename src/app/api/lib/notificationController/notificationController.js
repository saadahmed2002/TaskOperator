const express = require('express');
const Notification = require('../../model/Notification');
const { NextResponse } = require('next/server');
const router = express.Router();


const main = async (req, res) => {
    try {
        const { recipientId, message, taskId, type } = req.json();

        const newNotification = new Notification({
            recipientId,
            message,
            taskId,
            type,
            read: false,
        });

      const newNotifications =   await newNotification.save()
       return NextResponse.json({ message: 'Notification created successfully', notification: newNotification });
    } catch (error) {
        console.error('Error creating notification:', error);
       return NextResponse.json({ message: 'Failed to create notification' });
    }
};

const getnotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.params.userId }).sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (error) {
       return NextResponse.json({ message: 'Failed to fetch notifications' });
    }
};

const markAsRead = async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true }, 
      { new: true }
    );

    if (!updatedNotification) {
     NextResponse.json({ message: 'Notification not found' });
    }

    return NextResponse.json({ message: 'Notification marked as read', notification: updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
   return NextResponse.json({ message: 'Failed to mark notification as read' });
  }
};



module.exports = {
    main,
    getnotification,
    markAsRead
};

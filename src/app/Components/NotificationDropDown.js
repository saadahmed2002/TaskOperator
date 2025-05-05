import { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationDropdown = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(`/api/notification/${userId}`, {
            withCredentials: true
          })
                    setNotifications(res.data); // Ensure you're fetching the latest notifications with updated `read` status
        } catch (err) {
          console.error('Error fetching notifications:', err.message);
        }
      };
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Fetch every 10s

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Send a request to mark as read on the server
      await axios.patch(`/api/notification/readed/${notificationId}`,
        {
          withCredentials: true
        });
      
      // Optimistically update the local state
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      fetchNotifications()
    } catch (err) {
      console.error('Error marking notification as read:', err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none text-white"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
          <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center">No notifications</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`text-sm cursor-pointer ${
                    n.read ? 'text-gray-400' : 'text-white font-medium'
                  } border-b border-gray-700 py-2 px-1 hover:bg-gray-700 rounded-md transition-colors duration-150`}
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

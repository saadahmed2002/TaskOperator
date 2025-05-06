import React, { useState } from 'react'

export default function DashboardTasks() {
    const [task, setTasks] = useState([])
    const fetchTasks = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task/dashboardTasks`, {
            credentials: 'include',
          });
      
          if (!res.ok) {
            throw new Error('Failed to fetch tasks');
          }
      
          const allTasks = await res.json();
      
          const pendingTasks = allTasks
            .filter(task => task.status === 'Pending')
            .slice(0, 5);
      
          setTasks(pendingTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
      
  return (
    <div>DashboardTasks</div>
  )
}

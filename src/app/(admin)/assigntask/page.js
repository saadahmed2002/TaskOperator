'use client';

import Loader from '@/app/Components/Loader';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AssignTaskPage() {
  const [load, setLoading] = useState(false)
  const router = useRouter();

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedDate: new Date().toISOString().split('T')[0], 
    status: 'Pending',
    priority: 'Low',
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
     
      try {
        const res = await fetch(`/api/user/teamMembers`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch members');

        const members = await res.json();
        setTeamMembers(members.users);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`/api/auth/me`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.user) {
          setCurrentUser(data.user);
        } else {
          console.error('User data not found');
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    fetchCurrentUser();
    fetchTeamMembers();
  }, []);

  const createNotification = async (recipientId, message, taskId) => {
    try {
      await fetch(`/api/notification/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipientId,
          message,
          taskId,
          type: 'task-assigned', 
        }),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAssignTask = async () => {
    setLoading(true)
    if (!task.title || !task.description || !task.dueDate || !assignedMemberId) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch(`/api/task/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...task,
          assignedTo: assignedMemberId,
          assignedBy: currentUser._id,
        }),
      });

      if (!res.ok) throw new Error('Failed to assign task');

      const result = await res.json();

      await createNotification(
        assignedMemberId,
        `You have been assigned a new task: "${result.title}"`,
        result._id
      );

   
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Error assigning task');
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-gray-900 text-white p-6 sm:p-10">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-10">Create and Assign Task</h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-blue-200">Task Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-blue-200">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-blue-200">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-200">Assigned Date</label>
              <input
                type="date"
                name="assignedDate"
                value={task.assignedDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-blue-200">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-blue-200">Assign to Member</label>
            <select
              value={assignedMemberId}
              onChange={(e) => setAssignedMemberId(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
            >
              <option value="">Select a team member</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.designation})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-10">
          <button
            onClick={handleAssignTask}
          disabled={load}
            className="bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-400 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Assign Task
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 disabled:cursor-not-allowed  hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Cancel
          </button>
        </div>
        <div className="p-4">

           {
             load && <Loader/>
            }
            </div>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '@/app/context/Authcontext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AssignTaskPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedDate: new Date().toISOString().split('T')[0],  
    status: 'Pending',
    priority: 'Medium', 
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {

    const fetchCurrentMember = async () => {
      try {
        const res = await fetch(`/api/auth/me`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.user) {
          setCurrentMember(data.user);
        } else {
          console.error('User data not found');
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

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
    fetchCurrentMember();
    fetchTeamMembers();
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

const createNotification = async (recipientId, message, taskId) => {
  try {
    const notificationType = 'task-assigned'; 
    await fetch(`/api/notification/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        recipientId,
        message,
        taskId,
        type: notificationType,
      }),
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};


  const handleAssignTask = async () => {
    if (!task.title || !task.description || !task.dueDate || !task.priority || !assignedMemberId) {
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
          assignedBy: currentMember._id,
        }),
      });

      if (!res.ok) throw new Error('Failed to assign task');

      const result = await res.json();

      await createNotification(
        assignedMemberId,
        `You have been assigned a new task: "${result.title}"`,
        result._id
      );
      alert(`Task "${result.title}" successfully assigned.`);
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Error assigning task');
    }
  };

  const filteredMembers = teamMembers.filter(member => member._id !== currentUser?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 sm:p-10">
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
                disabled
                className="w-full p-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
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
              {filteredMembers.map((member) => (
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
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Assign Task
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

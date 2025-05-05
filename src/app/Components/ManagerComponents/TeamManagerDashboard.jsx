'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/Authcontext';
import TeamMemberList from './TeamMemberList';
import ConfirmDialog from '../ConfirmDialogBox';
import Loader from '../Loader';

export default function DashboardPage() {
  const [loadingsomething, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskAssignee, setTaskAssignee] = useState('');
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  

  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/members`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch members');
      const members = await res.json();
     
      setTeamMembers(members.users);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
    setLoading(false)
  };
  const handleDeleteTaskDialog = (taskId) => {
    setLoading(true)
    const task = tasks.find(t => t._id === taskId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete The Task',
      message: `Are you sure you want to delete "${task.title}" ?`,
      onConfirm: () => handleDeleteTask(taskId),
    });
    setLoading(false)
  };
  

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/task/dashboardTasks`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const allTasks = await res.json();
      const pendingTasks = allTasks.filter(task => task.status === 'Pending').slice(0, 5);
      setTasks(pendingTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }setLoading(false)
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user) {
      fetchTasks();
      fetchTeamMembers();
    }
  }, [loading, user]);

  const handleDeleteTask = async (taskId) => {
    setLoading(true)
    try {
      await fetch(`/api/task/deleteTask/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      setTasks(prev => prev.filter(task => task._id !== taskId)); // Use _id for filtering
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
    setLoading(false)
  };

  const handleAssignTask = async (taskId) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/task/assign/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ assignee: taskAssignee }),
      });

      const updatedTask = await res.json();

      if (res.ok && updatedTask) {
        setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task)); // Use _id for comparison
      }

      setSelectedTaskId(null);
      setTaskAssignee('');
    } catch (error) {
      console.error('Failed to assign task:', error);
    }
    setLoading(false)
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t._id === taskId); // Use _id for the task search
    if (task) setTaskBeingEdited({ ...task });
  };

  const saveEditedTask = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/task/editTask/${taskBeingEdited._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(taskBeingEdited),
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await res.json();

      console.log('Updated Task:', updatedTask);  // Log the response for debugging

      if (!updatedTask || !updatedTask._id) {
        throw new Error('Invalid updated task from server');
      }

      setTasks(prev =>
        prev.map(task => task._id === updatedTask._id ? updatedTask : task) // Use _id for comparison
      );

      setTaskBeingEdited(null);
    } catch (error) {
      console.error('Error saving edited task:', error.message);
    }
    setLoading(false)
  };

  const filteredTasks = tasks.filter(task =>
    (!searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!filterStatus || task.status === filterStatus) &&
    (!filterPriority || task.priority === filterPriority) &&
    (!filterDueDate || task.dueDate === filterDueDate)
  );

  if (loading || !user) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white">
      <div className="max-w-6xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-2xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </header>

       
        <div className="overflow-x-auto">
  <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
    <thead>
      <tr className="text-left text-gray-300 border-b border-gray-700">
        <th className="p-3 text-sm font-medium">Title</th>
        <th className="p-3 text-sm font-medium">Description</th>
        <th className="p-3 text-sm font-medium">Due</th>
        <th className="p-3 text-sm font-medium">Priority</th>
        <th className="p-3 text-sm font-medium">Status</th>
        <th className="p-3 text-sm font-medium">Assignee</th>
        <th className="p-3 text-sm font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredTasks.length > 0 ? filteredTasks.map((task, index) => (
        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
          <td className="p-3 max-w-xs truncate">{task.title}</td>
          <td className="p-3 max-w-xs truncate">{task.description}</td>
          <td className="p-3">{new Date(task.dueDate).toLocaleDateString()}</td>
          <td className="p-3">{task.priority}</td>
          <td className="p-3">
            <span className={`text-sm font-semibold ${task.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
              {task.status}
            </span>
          </td>
          <td className="p-3">{  task.assignedTo?.name || 'Unassigned'}</td>
          <td className="p-3 space-x-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => handleEditTask(task._id)}
            >
              Update
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => handleDeleteTaskDialog(task._id)}
            >
              Delete
            </button>
          </td>
       
        </tr>
      )) : (
        <tr><td colSpan="7" className="text-center py-4 text-white">No Pending Tasks!</td></tr>
      )}
    </tbody>
  </table>
</div>

        <TeamMemberList teamMembers={teamMembers} router={router} />

        {selectedTaskId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Assign Task</h3>
              <select
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)} >
                {teamMembers.map(member => (
                  <option key={member.id} value={member.email}>{member.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-4">
                <button onClick={() => setSelectedTaskId(null)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
                <button onClick={() => handleAssignTask(selectedTaskId)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Assign</button>
              </div>
            </div>
          </div>
        )}

        {taskBeingEdited && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-[500px] text-white space-y-4">
              <h3 className="text-lg font-semibold">Edit Task</h3>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 rounded"
                value={taskBeingEdited.title}
                onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, title: e.target.value })}
                placeholder="Title"
              />
              <textarea
                className="w-full p-2 bg-gray-700 rounded"
                value={taskBeingEdited.description}
                onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, description: e.target.value })}
                placeholder="Description"
              />
           <input
  type="date"
  className="w-full p-2 bg-gray-700 rounded"
  value={taskBeingEdited.dueDate?.slice(0, 10)}
  onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, dueDate: e.target.value })}
/>


              <select
                className="w-full p-2 bg-gray-700 rounded"
                value={taskBeingEdited.priority}
                onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                className="w-full p-2 bg-gray-700 rounded"
                value={taskBeingEdited.status}
                onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, status: e.target.value })}
              >
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="w-full flex justify-center p-2">

             {
              loadingsomething ? <Loader size={16}/> : null
             }
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setTaskBeingEdited(null)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500">
                  Cancel
                </button>

                <button onClick={saveEditedTask} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
       <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}

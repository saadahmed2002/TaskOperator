'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import ConfirmDialog from '@/app/Components/ConfirmDialogBox';

import { useRouter } from 'next/navigation';

export default function AssignedTasksPage() {
  const [load, setLoad] = useState(false)
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
const API = process.env.NEXT_PUBLIC_API_URL
useEffect(() => {
  if (!loading && !user) {
    router.replace('/login');
  } else if (user) {
    fetchAssignedTasks();
  }
// remove assignedTasks from dependency array
}, [user, loading]);


  const fetchAssignedTasks = async () => {
    try {
      const res = await fetch(`/api/task/allTasks`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`Failed to fetch tasks`);
      const data = await res.json();
      
      setAssignedTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleMarkAsComplete = (taskId) => {
    const task = assignedTasks.find(t => t._id === taskId);
    setConfirmDialog({
      isOpen: true,
      title: 'Mark Task as Complete',
      message: `Are you sure you want to mark "${task.title}" as completed?`,
      onConfirm: () => markAsComplete(taskId),
    });
  };
  const handleDeleteTaskDialog = (taskId) => {
    const task = assignedTasks.find(t => t._id === taskId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete The Task',
      message: `Are you sure you want to delete "${task.title}" ?`,
      onConfirm: () => handleDeleteTask(taskId),
    });
  };

  
  const markAsComplete = async (taskId) => {
    
    try {
      const task = assignedTasks.find(task => task._id === taskId);
      if (!task) return;

      const res = await fetch(`/api/task/editTask/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...task, status: 'Completed' }),
      });

      if (!res.ok) throw new Error('Failed to mark as complete');

      const updated = await res.json();
      setAssignedTasks(prev => prev.map(t => t._id === taskId ? updated : t));
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = assignedTasks.find(task => task._id === taskId);
    if (taskToEdit) setTaskBeingEdited({ ...taskToEdit });
  };

  const saveEditedTask = async () => {
    setLoad(true)
    try {
      const res = await fetch(`/api/task/editTask/${taskBeingEdited._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(taskBeingEdited),
      });

      if (!res.ok) throw new Error('Failed to update task');

      const updatedTask = await res.json();

      setAssignedTasks(prev =>
        prev.map(task => task._id === updatedTask._id ? updatedTask : task)
      );
      setTaskBeingEdited(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setLoad(false)
  };

  const handleDeleteTask = async (taskId) => {
  
    try {
      const resp = await fetch(`/api/task/deleteTask/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (resp.ok) {
        setAssignedTasks(prev => prev.filter(task => task._id !== taskId));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = assignedTasks.filter(task =>
    (!searchQuery || task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery)) &&
    (!filterStatus || task.status === filterStatus) &&
    (!filterDueDate || new Date(task.dueDate).toISOString().split('T')[0] === filterDueDate)
  );

  if (loading || !user) return <p className="text-center mt-10 text-white">Loading...</p>;
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-3xl shadow-lg">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Assigned Tasks</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6 items-end">
          <div>
            <label className="block text-white mb-1">Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full p-2 rounded bg-gray-600 text-white placeholder:text-gray-300"
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </div>
          <div>
            <label className="block text-white mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full p-2 rounded bg-gray-600 text-white"
            >
              <option value="">All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-1">Due Date</label>
            <input
              type="date"
              value={filterDueDate}
              onChange={e => setFilterDueDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-600 text-white"
            />
          </div>
          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('');
                setFilterDueDate('');
              }}
              className="mt-6 w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-400">No tasks match your filters.</p>
        ) : (
          <ul className="space-y-6">
            {filteredTasks.map(task => (
              <li
                key={task._id}
                className="bg-gray-800 rounded-2xl shadow-lg p-6 transition hover:scale-[1.01] hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedTaskForView(task)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{task.title}</h3>
                    <p className="text-gray-300 mb-3 line-clamp-2">{task.description}</p>

                    <div className="text-sm text-gray-400 space-y-1">
                      <p><span className="font-medium text-white">Due:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
                      <p><span className="font-medium text-white">Assigned On:</span> {new Date(task.assignedDate).toLocaleDateString()}</p>
                      <p><span className="font-medium text-white">Priority:</span> {task.priority}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>
                        <span className="font-medium text-white">Assigned By:</span>{' '}
                        {user.name === task.assignedBy.name ? 'Me' : task.assignedBy.name}
                      </p>
                      <p><span className="font-medium text-white">To:</span> {task.assignedTo.name}</p>
                      <p className={`font-semibold ${task.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                        Status: {task.status}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsComplete(task._id);
                          }}
                          className="bg-green-600 text-white px-4 py-1.5 rounded-xl hover:bg-green-700 transition"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task._id);
                        }}
                        className="text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTaskDialog(task._id);
                        }}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Task Modal */}
      {taskBeingEdited && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            value={formatDate(taskBeingEdited.dueDate)}
            onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, dueDate: e.target.value })}
          />
          
            <select
              value={taskBeingEdited.priority}
              onChange={(e) => setTaskBeingEdited({ ...taskBeingEdited, priority: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="" disabled>Select Priority</option>
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
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500" onClick={() => setTaskBeingEdited(null)}>
                Cancel
              </button>
              <button className="bg-blue-600 disabled:bg-blue-400 px-4 py-2 rounded hover:bg-blue-700" disabled={load} onClick={saveEditedTask}>
                Save Changes
              </button>
            </div>

            
          </div>
        </div>
      )}
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

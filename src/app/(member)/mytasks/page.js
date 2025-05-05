'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/Authcontext';

export default function MyTasksPage() {
  
  const [selectedTask, setSelectedTask] = useState(null); // Task shown in modal
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: '',
  });
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
  });

  // Fetch tasks from backend when component mounts
  useEffect(() => {
    const fetchTasks = async () => {

      if (!currentUser) {
        alert('NO ID');
        return;
      }

      try {
        const response = await fetch(
          `/api/task/assignedByMe/${currentUser._id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        const data = await response.json();
        setTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (currentUser && currentUser._id) {
      fetchTasks();
    }
  }, [currentUser]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    const result = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description.toLowerCase().includes(lowerSearch);

      const matchesStatus = filters.status
        ? task.status === filters.status
        : true;
      const matchesPriority = filters.priority
        ? task.priority === filters.priority
        : true;
      const matchesDueDate = filters.dueDate
        ? task.dueDate === filters.dueDate
        : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDueDate
      );
    });

    setFilteredTasks(result);
  }, [searchTerm, filters, tasks]);

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const updatedTask = { ...editForm };

      // Use the same API endpoint as `saveEditedTask`
      const res = await fetch(
        `/api/task/editTask/${taskId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Assuming authentication is needed
          body: JSON.stringify(updatedTask),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      const updated = await res.json();

      // Handle the response and update task list
      if (!updated || !updated._id) {
        throw new Error('Invalid updated task from server');
      }

      // Update the task list with the updated task
      setTasks((prev) =>
        prev.map((task) => (task._id === updated._id ? updated : task)) // Use _id for comparison
      );

      // Reset the editing task state
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      dueDate: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tasks You Assigned</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by title or description"
            className="bg-gray-700 text-white p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Status</label>
          <select
            className="bg-gray-700 text-white p-2 rounded"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Priority</label>
          <select
            className="bg-gray-700 text-white p-2 rounded"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Due Date</label>
          <input
            type="date"
            className="bg-gray-700 text-white p-2 rounded"
            value={filters.dueDate}
            onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setFilters({ status: '', priority: '', dueDate: '' });
              setSearchTerm('');
            }}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>
        {/* Task Cards */}
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400">Not available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 cursor-pointer"
                onClick={() => {
                  if (!editingTask) setSelectedTask(task);
                }}
              >
                {editingTask === task._id ? (
                  <>
                    <input
                      className="bg-gray-700 text-white w-full p-2 mb-2 rounded"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                    />
                    <textarea
                      className="bg-gray-700 text-white w-full p-2 mb-2 rounded"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                    />
                    <input
                      type="date"
                      name="dueDate"
                      className="bg-gray-700 text-white w-full p-2 mb-2 rounded"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                    />
                    <select
                      name="priority"
                      className="bg-gray-700 text-white w-full p-2 mb-2 rounded"
                      value={editForm.priority}
                      onChange={handleEditChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <select
                      name="status"
                      className="bg-gray-700 text-white w-full p-2 mb-2 rounded"
                      value={editForm.status}
                      onChange={handleEditChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="inProgress">In Progress</option>
                      <option value="Failed">Failed</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      onClick={() => handleSaveEdit(task._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-2"
                      onClick={() => {
                        setEditingTask(null);
                        setSelectedTask(null);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-blue-400 mb-2 line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{task.description}</p>

                    <p className="text-md text-white mb-1">
                      <span className=" text-sm font-semibold text-white">Assigned To:</span>{' '}
                      {task.assignedTo.name}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      <span className="font-semibold text-white">Due Date:</span> {task.dueDate}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      <span className="font-semibold text-white">Priority:</span>{' '}
                      <span
                        className={`${
                          task.priority === 'High'
                            ? 'text-red-400'
                            : task.priority === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      <span className="font-semibold text-white">Status:</span>{' '}
                      <span
                        className={`${
                          task.status === 'Completed'
                            ? 'text-green-400'
                            : task.status === 'In Progress'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-700 shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-blue-400 mb-4">{selectedTask.title}</h2>
            <p className="text-gray-300 mb-2">{selectedTask.description}</p>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-semibold text-white">Assigned To:</span> {selectedTask.assignedTo.name}
            </p>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-semibold text-white">Due Date:</span> {selectedTask.dueDate}
            </p>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-semibold text-white">Priority:</span>{' '}
              <span
                className={`${
                  selectedTask.priority === 'High' ? 'text-red-400' :
                  selectedTask.priority === 'Medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}
              >
                {selectedTask.priority}
              </span>
            </p>
            <p className="text-sm text-gray-400 mb-4">
              <span className="font-semibold text-white">Status:</span>{' '}
              <span
                className={`${
                  selectedTask.status === 'Completed' ? 'text-green-400' :
                  selectedTask.status === 'In Progress' ? 'text-yellow-400' :
                  'text-red-400'
                }`}
              >
                {selectedTask.status}
              </span>
            </p>

            <button
              onClick={() => {
                handleEditClick(selectedTask);
                setSelectedTask(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Edit Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

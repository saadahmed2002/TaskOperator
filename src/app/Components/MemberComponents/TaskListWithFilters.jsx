'use client';

import { useEffect, useState } from 'react';

export default function TaskListWithFilters({ user }) {
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: '',
  });

useEffect(() =>{
  fetchAssignedTasks()
  if(!user) window.location = "/"


},[])

  const fetchAssignedTasks = async () => {
    setLoading(true)


    try {

      const response = await fetch(`/api/task/assignedToMe/${user._id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
  
        setTasks(data);
        setFilteredTasks(data);
      
        
      } else {
        const errorMessage = await response.text();
       if(errorMessage.message == "No tasks assigned to you") return <h1>No tasks assigned to you</h1>

      }
    } catch (error) {
      console.error( error);
    } finally {
      setTasksLoading(false);
      setLoading(false)
    }
  };

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const result = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description.toLowerCase().includes(lowerSearch);
      const matchesStatus = filters.status ? task.status === filters.status : true;
      const matchesPriority = filters.priority ? task.priority === filters.priority : true;
      const matchesDueDate = filters.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0] === filters.dueDate
      : true;
    
      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    });

    setFilteredTasks(result);
  }, [searchTerm, filters, tasks]);
  const handleMarkFailed = async (taskId) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/task/markFailed/${taskId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
  
      if (response.ok) {
        const updatedTasks = tasks.map(task =>
          task._id === taskId ? { ...task, status: 'Failed' } : task
        );
        setTasks(updatedTasks);
        setSelectedTask(null);
      } else {
        console.error('Failed to mark task as failed');
      }
    } catch (error) {
      console.error('Error marking task as failed:', error);
    }
    setLoading(false)
  };
  
  const handleMarkCompleted = async (taskId) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/task/markCompleted/${taskId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
  
      if (response.ok) {
        const updatedTasks = tasks.map(task =>
          task._id === taskId ? { ...task, status: 'Completed' } : task
        );
        setTasks(updatedTasks);
        setSelectedTask(null);
      } else {
        console.error('Failed to mark task as completed');
      }
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
    setLoading(false)
  };
  
  return (
    <>
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

      {tasksLoading ? (
        <p className="text-center text-gray-400">Loading your tasks...</p>
      ) : filteredTasks.length  < 1 ? (
        <p className="text-gray-400">Not Available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          { filteredTasks.length > 0 ? filteredTasks.map((task) => (
            <div key={task._id} className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 cursor-pointer" onClick={() => setSelectedTask(task)}>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">{task.title}</h3>
              <p className="text-gray-300 mb-4">{task.description}</p>
              <p className="text-sm text-gray-400 mb-1">
                <span className="font-semibold text-white">Assigned By:</span> {task.assignedBy.name}
              </p>
              <p className="text-sm text-gray-400 mb-1">
                <span className="font-semibold text-white">Due:</span> {new Date(task.dueDate).toISOString().split('T')[0]}
              </p>
              <p className="text-sm text-gray-400 mb-1">
                <span className="font-semibold text-white">Priority:</span>{' '}
                <span className={task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}>
                  {task.priority}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">Status:</span>{' '}
                <span className={task.status === 'Completed' ? 'text-green-400' : task.status === 'In Progress' ? 'text-yellow-400' : 'text-red-400'}>
                  {task.status}
                </span>
              </p>
            </div>
          )) : <h1>NO task for you</h1>
          
          }
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1f2937] p-8 rounded-2xl shadow-2xl w-[500px] text-white space-y-5 border border-gray-700">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {selectedTask.title}
            </h3>
            <p className="text-gray-300 text-base">{selectedTask.description}</p>
            <div className="space-y-1 text-sm text-gray-400">
              <p><span className="font-semibold text-white">Assigned By:</span> {selectedTask.assignedBy?.name || 'Unknown'}</p>
              <p><span className="font-semibold text-white">Due:</span> {selectedTask.dueDate}</p>
              <p>
                <span className="font-semibold text-white">Priority:</span>{' '}
                <span className={selectedTask.priority === 'High' ? 'text-red-400' : selectedTask.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}>
                  {selectedTask.priority}
                </span>
              </p>
              <p>
                <span className="font-semibold text-white">Status:</span>{' '}
                <span className={selectedTask.status === 'Completed' ? 'text-green-400' : selectedTask.status === 'In Progress' ? 'text-yellow-400' : 'text-red-400'}>
                  {selectedTask.status}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setSelectedTask(null)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                Close
              </button>
              {selectedTask.status !== 'Completed' && selectedTask.status !== 'Failed' && (
  <>
     
    <button
      onClick={() => handleMarkCompleted(selectedTask._id)}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-gradient-to-r bg-green-600 hover:bg-green-400 disabled:bg-green-400 text-black font-semibold transition-all duration-200 shadow-sm"
    >
      Mark as Completed
    </button>
    <button
      onClick={() => handleMarkFailed(selectedTask._id)}
      disabled={loading}
      className="px-4 py-2 rounded-lg  bg-red-600 hover:bg-red-400 disabled:bg-red-400 text-black font-semibold transition-all duration-200 shadow-sm"
    >
      Mark as Failed
    </button>
  </>
  
)}


            </div>
           {
            loading ?  <div className="flex justify-center p-2">

            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div> : null
           }
          </div>
        </div>
      )}
    </>
  );
}

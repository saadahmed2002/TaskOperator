'use client';

import ConfirmDialog from '@/app/Components/ConfirmDialogBox';
import { useParams, useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import { LuCircleCheckBig, LuNotepadText } from 'react-icons/lu';
import { MdOutlinePendingActions, MdOutlineSmsFailed } from 'react-icons/md';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter()
  const { id } = params 

  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [stats, setStats] = useState({ assigned: 0, completed: 0 });
   const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
    useEffect(() => {
      const fetchTaskStats = async () => {
        if(!id) return
        try {
          const res = await fetch(`/api/task/stats/${id}`, {
            method: 'GET',
            credentials: 'include',
          });
  
          if (res.ok) {
            const data = await res.json();
    
            setStats({ assigned: data.assigned, completed: data.completed, pending: data.pending, failed: data.failed });
          } else {
            console.error('Error fetching task stats');
          }
        } catch (err) {
          console.error('Error fetching task stats:', err);
        } finally {
          setLoading(false);
        }
      };
  
      if (id) {
        fetchTaskStats();
      }
    }, []);


  useEffect(() => {
    if (!id) return;

    const fetchMemberData = async () => {
      try {
        const res = await fetch(`/api/user/member/${id}`, {
          credentials: 'include', 
        });

        if (!res.ok) throw new Error('Failed to fetch member data');

        const data = await res.json();
        
        setMember(data.member); 
        setTasks(data.tasks || []);
      } catch (error) {
        console.error(error);
        alert('Error loading profile');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  const handleDeleteTaskDialog = () => {
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete The Member',
      message: `Are you sure you want to delete "${member.name}" ?`,
      onConfirm: () => handleDelete(),
    });
  };
  
  const handleDelete = async () => {
    try {
      await fetch(`/api/user/member/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
     
      router.push('/');
    } catch {
      alert('Failed to delete member');
    }
  };

  const handleNotify = () => {
    alert(`Notification sent to ${member.email}`);
  };

  const handleAssignTask = () => {
    alert(`Assigned new task to ${member.name}`);
  };

  const handleDismissTask = (title) => {
    setTasks(tasks.filter((task) => task.title !== title));
    alert(`Dismissed task: ${title}`);
  };

  const handleUpdateMember = () => {
    alert(`Member info updated`);
  };

  if (loading) return <div className="text-white p-10">Loading profile...</div>;
  if (!member) return <div className="text-white p-10">User not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">Profile</h1>
          <button
            onClick={handleDeleteTaskDialog}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            Delete Member
          </button>
        </header>

        <section className="mb-8">
          <div className="mb-4">
          
            <p><strong>Name:</strong> {member.name}</p>
            <p><strong>Email:</strong> {member.email}</p>
            <p><strong>Designation:</strong> {member.designation}</p>
          </div>
        
        </section>

          <div className="grid grid-cols-2 gap-4 my-9">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <h2 className="text-5xl font-bold p-2">{stats.assigned}</h2>
                    <div className="flex justify-center">
                      <p className="text-gray-400 text-xl">Tasks Assigned</p>
                      <div className="p-1">
                        <LuNotepadText size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="justify-center flex">
                      <h2 className="text-5xl font-bold flex p-2">{stats.completed}</h2>
                    </div>
                    <div className="flex justify-center">
                      <p className="text-gray-400 text-xl">Tasks Completed</p>
                      <div className="p-1">
                        <LuCircleCheckBig size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="justify-center flex">
                      <h2 className="text-5xl font-bold flex p-2">{stats.pending}</h2>
                    </div>
                    <div className="flex justify-center">
                      <p className="text-gray-400 text-xl">Tasks Pending</p>
                      <div className="p-1">
                        <MdOutlinePendingActions size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="justify-center flex">
                      <h2 className="text-5xl font-bold flex p-2">{stats.failed}</h2>
                    </div>
                    <div className="flex justify-center">
                      <p className="text-gray-400 text-xl">Tasks Failed</p>
                      <div className="p-1">
                        <MdOutlineSmsFailed size={20} />
                      </div>
                    </div>
                  </div>
                </div>

        <section className="flex justify-end">
          <button onClick={() => router.back()} className="p-3 bg-blue-500 rounded-3xl m-3">Go back</button>
        </section>
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

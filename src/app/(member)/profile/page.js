'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/Authcontext';
import UpdateProfileForm from '@/app/Components/UpdateProfile';
import { LuCircleCheckBig, LuCircleUser, LuNotepadText } from 'react-icons/lu';
import { MdOutlinePendingActions, MdOutlineSmsFailed } from "react-icons/md";

export default function MemberProfile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assigned: 0, completed: 0 });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Fetch task stats from the API
    const fetchTaskStats = async () => {
      if(!user) return
      try {
        const res = await fetch(`/api/task/stats/${user._id}`, {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (res.ok) {
          const data = await res.json();
          setStats({ assigned: data.assigned, completed: data.completed, pending: data.pending, failed: data.failed });
        } else {
          console.log('Error fetching task stats');
        }
      } catch (err) {
        console.error('Error fetching task stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTaskStats();
    }
  }, [user]); // Re-fetch task stats when the user changes

  const [showForm, setShowForm] = useState(false);

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;

  if (!user) return <p className="text-center text-white mt-10">No user data available</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-4xl font-bold mb-6 flex gap-3">
          Member Profile <LuCircleUser />
        </h1>

        {/* User Info Box */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mb-6">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Name:</span> {user.name}</p>
        </div>

        {/* Stats */}
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

        {/* Toggle Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition mb-4"
        >
          {showForm ? 'Cancel Update' : 'Update Profile'}
        </button>

        {/* Update Profile Form Box */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
            <UpdateProfileForm user={user} />
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import TaskListWithFilters from './TaskListWithFilters';
import { useAuth } from '@/app/context/Authcontext';

export default function TeamMemberDashboard() {
  const { logout, currentUser, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-xl font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Welcome, { currentUser ? currentUser.name : "Member"}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
          >
            Logout
          </button>
        </header>

        <h2 className="text-2xl font-semibold mb-6">Tasks Assigned To You!</h2>
        <TaskListWithFilters user={user} />
      </div>
    </div>
  );
}

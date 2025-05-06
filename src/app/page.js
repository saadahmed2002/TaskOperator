"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/Authcontext";
import TeamManagerDashboard from "./Components/ManagerComponents/TeamManagerDashboard";
import TeamMemberDashboard from "./Components/MemberComponents/TeamMemberDashboard";
import AdminNavbar from "./Components/ManagerComponents/ManagerNavbar";
import MemberNavbar from "./Components/MemberComponents/MemberNavbar";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = 'Task Management';
    if (!loading && !user) {
      router.replace("/login");  
    }
  }, [user, loading]);

  if (loading || !user) return  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 ">
  <div className="flex flex-col items-center text-white">
    <div className="animate-spin mb-4 w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-indigo-400"></div>
    <h1 className="text-2xl font-semibold">Loading, please wait...</h1>
  </div>
</div>;

  return (
    <div className="0">
      {
        user.role === 'manager' ? 
        <div className="">
          <AdminNavbar/>
          <TeamManagerDashboard/>
        </div>
        
        :
        <div className="">
        <MemberNavbar/>
          <TeamMemberDashboard/>
        </div>
      }
    </div>
  )
}

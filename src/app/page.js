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
      router.replace("/login"); // Redirect if not authenticated
    }
  }, [user, loading]);

  if (loading || !user) return <p className="text-center mt-10">Loading...</p>;

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

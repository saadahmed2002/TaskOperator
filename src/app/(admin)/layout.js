'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Authcontext';
import AdminNavbar from '../Components/ManagerComponents/ManagerNavbar';
import Loader from '../Components/Loader';

export default function ManagerLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login'); 
      } else if (user.role !== 'manager') {
        router.replace('/unauthorized'); 
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'manager') {
    return <div className="">

      <div className="text-center  mt-10">
        <Loader size={48} /></div>
    </div>
    
  }

  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}

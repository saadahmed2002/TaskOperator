'use client'
import React, { useEffect } from 'react'
import MemberNavbar from '../Components/MemberComponents/MemberNavbar'
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Authcontext';
import Loader from '../Components/Loader';

export default function layout({children}) {
  const router = useRouter();
    const { user, loading } = useAuth();
  
    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace('/login'); 
        } else if (user.role !== 'member') {
          router.replace('/unauthorized'); 
        }
      }
    }, [user, loading, router]);
  
    if (loading || !user || user.role !== 'member') {
      return <div className="">
  
        <div className="text-center  mt-10">
          <Loader size={48} /></div>
      </div>
      }
  
  return (
    <div>
        <MemberNavbar/>
        {children}
    </div>
  )
}

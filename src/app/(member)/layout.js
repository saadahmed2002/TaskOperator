import React from 'react'
import MemberNavbar from '../Components/MemberComponents/MemberNavbar'

export default function layout({children}) {
  
  return (
    <div>
        <MemberNavbar/>
        {children}
    </div>
  )
}

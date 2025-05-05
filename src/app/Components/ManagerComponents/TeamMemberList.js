import React, { useState } from 'react'

export default function ({teamMembers, router}) {
  const [ loading, setLoading] = useState(false)
  return (
    <div className="mt-10">
    <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {
      teamMembers.length > 0?
      teamMembers.map((member, index) => (
        <div
          key={index}
          onClick={() =>{ 
            
            router.push(`/profile/${member._id}`)}
          }
          className="bg-gray-800 p-4 rounded-lg shadow cursor-pointer hover:bg-blue-600"
        >
          
          <p className="font-bold">{member.name}</p>
          <p className="text-sm text-gray-300">{member.email}</p>
        </div>
      )) :<h1 className='text-xl text-white'>No Members Added Yet!</h1>}
    </div>
  </div>
  )
}

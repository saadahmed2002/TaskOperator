import React from 'react'

export default function Loader({size}) {
   
  return (
    <div className='w-full flex justify-center'> <div className={` size-9 border-4 border-white border-t-transparent transition-discrete    rounded-full animate-spin`}></div></div>
  )
}

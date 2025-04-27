import React from 'react'
import { Navbar } from '@/components/dashboard/NavBar'

const Dashboard = () => {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Navbar />
      <div className='flex flex-col h-screen w-screen bg-gray-100'>
        hello
      </div>
    </div>
  )
}

export default Dashboard
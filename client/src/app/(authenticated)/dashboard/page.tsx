import React from 'react'
import { Navbar } from '@/components/dashboard/NavBar'
import DocsDisplay from '@/components/dashboard/DocsDisplay'

const Dashboard = () => {
  return (
    <div className='flex flex-col h-full w-full'>
      <Navbar />
      <div className='flex-1'>
        <DocsDisplay />
      </div>
    </div>

  )
}

export default Dashboard
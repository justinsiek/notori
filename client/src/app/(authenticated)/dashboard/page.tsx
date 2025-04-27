import React from 'react'
import { Navbar } from '@/components/dashboard/NavBar'
import DocsDisplay from '@/components/dashboard/DocsDisplay'

const Dashboard = () => {
  const user = {
    id: '123',
    email: 'test@test.com',
    name: 'John Doe'
  }
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Navbar user={user} />
      <div className='flex-1'>
        <DocsDisplay />
      </div>
    </div>
  )
}

export default Dashboard
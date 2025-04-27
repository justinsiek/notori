'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/dashboard/NavBar'
import DocsDisplay from '@/components/dashboard/DocsDisplay'

interface User {
  id: string;
  email: string;
  created_at?: string; 
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user/me'); 

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const userData: User = await response.json();
        setUser(userData);
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        setError(err.message || 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>; 
  }

  if (error) {
    return <div>Error loading dashboard: {error}</div>;
  }

  return (
    <div className='flex flex-col h-screen w-screen'>
      {user && <Navbar user={user} />}
      <div className='flex-1'>
        <DocsDisplay />
      </div>
    </div>
  )
}

export default Dashboard
'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/document/NavBar'
import Toolbar from '@/components/document/Toolbar'
import Editor from '@/components/document/Editor'

interface User {
  id: string;
  email: string;
  created_at?: string; 
}

const DocumentPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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
    return <div>Loading document...</div>; 
  }

  if (error) {
    return <div>Error loading document: {error}</div>;
  }

  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden'>
      {/* Fixed header section */}
      <div className='flex-none'>
        {user && <Navbar user={user} toggleSidebar={toggleSidebar} />}
      </div>
      
      {/* Scrollable content area */}
      <div className='flex-1 overflow-hidden bg-gray-100'>
        <Editor sidebarOpen={sidebarOpen} />
      </div>
    </div>
  )
}

export default DocumentPage
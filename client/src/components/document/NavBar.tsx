'use client'

import { useState } from 'react';
import { User } from "lucide-react"
import { useRouter } from 'next/navigation';

export function Navbar({ user }: { user: any }) {
  const router = useRouter();

  const [title, setTitle] = useState<string>('Untitled Document');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleLogout = async () => {
    console.log("Attempting to log out via /api/logout...");
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log("Logout successful on server via proxy.");
        router.push('/login');
      } else {
        const data = await response.json().catch(() => ({}));
        console.error("Logout failed on server:", response.status, data.message || '');
      }
    } catch (error) {
      console.error("Error during logout request:", error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tighter text-black cursor-pointer" onClick={() => router.push('/dashboard')}>notori.ai</span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className="text-lg font-medium text-gray-800 w-full outline-none"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled Document"
              />
          </div>
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-sm" onClick={handleLogout}>
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
'use client'

import { useState } from 'react';
import { User, Save, History } from "lucide-react"
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
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Main navbar */}
      <div className="px-4 md:px-6 py-3">
        <div className="grid grid-cols-3">
          {/* Logo - left column */}
          <div className="flex items-center">
            <span 
              className="text-xl font-bold tracking-tighter text-black cursor-pointer" 
              onClick={() => router.push('/dashboard')}
            >
              notori.ai
            </span>
          </div>
          
          {/* Document title - center column */}
          <div className="flex justify-center items-center">
            <input
              type="text"
              className="text-lg font-medium text-gray-800 text-center outline-none bg-transparent max-w-[200px] sm:max-w-xs"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled Document"
            />
          </div>
          
          {/* Action buttons - right column */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-xs text-gray-500">Autosaved 5 seconds ago</span>
            
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-md text-sm transition-colors">
              <Save className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-md text-sm transition-colors">
              <History className="w-4 h-4" />
            </button>
            
            <div 
              className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors ml-1" 
              onClick={handleLogout}
            >
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;
'use client'

import { User } from "lucide-react"
import { useRouter } from 'next/navigation';

export function Navbar({ user }: { user: any }) {
  const router = useRouter();

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
      <div className="px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tighter text-black cursor-pointer" onClick={() => router.push('/')}>notori.ai</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogout}>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
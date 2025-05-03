'use client'

import { useState } from 'react';
import { User, Save, History, Bot } from "lucide-react"
import { useRouter } from 'next/navigation';

export function Navbar({ 
  user, 
  toggleSidebar, 
  initialTitle, 
  documentId,
  isSaving,
  lastSaved,
  onTitleSave,
  onEditStart
}: { 
  user: any, 
  toggleSidebar: () => void, 
  initialTitle: string,
  documentId: string,
  isSaving?: boolean,
  lastSaved?: boolean,
  onTitleSave?: () => void,
  onEditStart?: () => void
}) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(initialTitle);
  const [isTitleSaving, setIsTitleSaving] = useState<boolean>(false);
  const [hasEditedTitle, setHasEditedTitle] = useState<boolean>(false);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Notify parent on first edit only
    if (!hasEditedTitle && newTitle !== initialTitle && onEditStart) {
      onEditStart();
      setHasEditedTitle(true);
    }
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

  const handleSave = async () => {
    if (isTitleSaving) return;
    
    setIsTitleSaving(true);
    try {
      // Save document title
      const response = await fetch(`/api/documents/${documentId}/metadata`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: title 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save document');
      }
      
      // Notify parent that title was saved
      if (onTitleSave) {
        onTitleSave();
      }
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsTitleSaving(false);
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
              onBlur={handleSave} 
            />
          </div>
          
          {/* Action buttons - right column */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-xs text-gray-500">
              {isSaving || isTitleSaving ? 'Saving...' : lastSaved ? 'Saved' : ''}
            </span>
            
            <button 
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-md text-sm transition-colors"
              onClick={handleSave}
              disabled={isTitleSaving || isSaving}
            >
              <Save className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-md text-sm transition-colors">
              <History className="w-4 h-4" />
            </button>

            <button 
              onClick={toggleSidebar}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-md text-sm transition-colors"
            >
              <Bot className="w-4 h-4" />
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
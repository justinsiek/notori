import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';

interface EditorProps {
  sidebarOpen: boolean;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  documentId: string;
}

const Editor = ({ sidebarOpen, initialContent, onSave, documentId }: EditorProps) => {
  const [content, setContent] = useState<string>(initialContent);
  const [lastEditTime, setLastEditTime] = useState<number | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setLastEditTime(Date.now());
  };
  
  // Auto-save content when user stops typing
  useEffect(() => {
    if (!lastEditTime) return;
    
    const saveTimeout = setTimeout(() => {
      onSave(content);
    }, 5000); // Save 5 seconds after last edit
    
    return () => clearTimeout(saveTimeout);
  }, [content, lastEditTime, onSave]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Main editor area (adjust width based on sidebar visibility) */}
      <div className={`${sidebarOpen ? 'w-4/5' : 'w-full'} flex flex-col items-center overflow-auto py-12 px-4 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-100
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-200`}>
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md mb-8 flex flex-col">
          {/* Editor content */}
          <textarea
            className="w-full h-full p-16 outline-none resize-none text-sm"
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </div>
      
      {/* Sidebar (conditionally shown) */}
      {sidebarOpen && (
        <div className="w-1/5 border-l border-gray-200 overflow-auto
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default Editor; 
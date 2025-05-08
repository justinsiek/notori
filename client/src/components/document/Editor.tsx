import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './Sidebar';

interface EditorProps {
  sidebarOpen: boolean;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  documentId: string;
  onEditStart?: () => void;
}

const Editor = ({ sidebarOpen, initialContent, onSave, documentId, onEditStart }: EditorProps) => {
  const [content, setContent] = useState<string>(initialContent);
  const contentRef = useRef<string>(initialContent);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(initialContent);
  const isTypingRef = useRef<boolean>(false);
  const hasEditedRef = useRef<boolean>(false);
  
  const saveContent = useCallback(() => {
    // only save if content has changed since last save
    if (contentRef.current !== lastSavedContentRef.current) {
      onSave(contentRef.current);
      lastSavedContentRef.current = contentRef.current;
    }
    saveTimeoutRef.current = null;
  }, [onSave]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (newContent !== contentRef.current && onEditStart) {
      onEditStart();
    }
    
    setContent(newContent);
    contentRef.current = newContent;
    isTypingRef.current = true;
    
    scheduleSave();
  };
  
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      saveContent();
    }, 500); 
  }, [saveContent]);
  
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className={`${sidebarOpen ? 'w-2/3' : 'w-full'} flex flex-col items-center overflow-auto py-12 px-4 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-100
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-200`}>
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md mb-8 flex flex-col">
          <textarea
            className="w-full h-full p-16 outline-none text-sm"
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </div>
      
      {sidebarOpen && (
        <div className="w-1/3 border-l border-gray-200 overflow-auto
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          <Sidebar documentContent={content} documentId={documentId} />
        </div>
      )}
    </div>
  );
};

export default Editor; 
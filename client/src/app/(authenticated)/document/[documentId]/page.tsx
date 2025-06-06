'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/document/NavBar'
import Toolbar from '@/components/document/Toolbar'
import Editor from '@/components/document/Editor'
import { useParams } from 'next/navigation'

interface User {
  id: string;
  email: string;
  created_at?: string; 
}

interface Document {
  id: string;
  title: string;
  user_id: string;
  s3_object_key: string;
  created_at: string;
  updated_at: string;
}

const DocumentPage = () => {
  const params = useParams();
  const documentId = params.documentId as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchUserAndDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user data
        const userResponse = await fetch('/api/user/me');
        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        const userData: User = await userResponse.json();
        setUser(userData);

        // Fetch document content
        const docResponse = await fetch(`/api/documents/${documentId}/content`);
        if (!docResponse.ok) {
          throw new Error(`HTTP error! status: ${docResponse.status}`);
        }
        const docData = await docResponse.json();
        setDocument(docData.document);
        setContent(docData.content);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndDocument();
  }, [documentId]);

  const saveContent = useCallback(async (newContent: string) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: newContent,
      });
      
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      
      setContent(newContent);
      setLastSaved(true);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  }, [documentId, isSaving]);

  const handleTitleSave = useCallback(() => {
    setLastSaved(true);
  }, []);

  const handleEditStart = useCallback(() => {
    setLastSaved(false);
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
        {user && <Navbar 
          user={user} 
          toggleSidebar={toggleSidebar} 
          initialTitle={document?.title || 'Untitled'} 
          documentId={documentId}
          isSaving={isSaving}
          lastSaved={lastSaved}
          onTitleSave={handleTitleSave}
          onEditStart={handleEditStart}
        />}
      </div>
      
      {/* Scrollable content area */}
      <div className='flex-1 overflow-hidden bg-gray-100'>
        <Editor 
          sidebarOpen={sidebarOpen} 
          initialContent={content} 
          onSave={saveContent}
          documentId={documentId}
          onEditStart={handleEditStart}
        />
      </div>
    </div>
  )
}

export default DocumentPage
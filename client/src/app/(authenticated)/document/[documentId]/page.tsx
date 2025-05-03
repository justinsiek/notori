'use client'

import React, { useState, useEffect } from 'react'
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
        {user && <Navbar user={user} toggleSidebar={toggleSidebar} initialTitle={document?.title || 'Untitled'} />}
      </div>
      
      {/* Scrollable content area */}
      <div className='flex-1 overflow-hidden bg-gray-100'>
        <Editor sidebarOpen={sidebarOpen} />
      </div>
    </div>
  )
}

export default DocumentPage
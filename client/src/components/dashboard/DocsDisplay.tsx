import React, { useState, useEffect } from 'react'
import DocCard from './DocCard'
import { Plus } from 'lucide-react'

const DocsDisplay = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents/', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDocuments(data.documents);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async () => {
    try {
      
      const response = await fetch('/api/documents/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Document created:', data);
      
      setDocuments(prevDocuments => [data.document, ...prevDocuments]);
      
    } catch (err) {
      console.error('Failed to create document:', err);
      setError('Failed to create document. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className='h-full w-full bg-gray-100 p-12 flex justify-center items-center'>
        <p className='text-gray-600'>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-full w-full bg-gray-100 p-12 flex justify-center items-center'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='h-full w-full bg-gray-100 p-12 grid grid-cols-6 gap-12'>
      <div 
        className='bg-white h-[240px] w-[210px] shadow-sm flex flex-col justify-center items-center cursor-pointer hover:shadow-md space-y-2'
        onClick={handleCreateDocument}
      >
        <Plus size={24} className='text-black' />
        <p className='text-gray-600 text-sm'>New Document</p>
      </div>
      {documents.map((document) => (
        <DocCard key={document.id} document={document} />
      ))}
    </div>
  );
};

export default DocsDisplay;
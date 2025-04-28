import React, { useState, useEffect } from 'react'
import DocCard from './DocCard'

const DocsDisplay = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchDocuments();
  }, []);

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

  if (documents.length === 0) {
    return (
      <div className='h-full w-full bg-gray-100 p-12 flex justify-center items-center'>
        <p className='text-gray-600'>No documents found. Create your first document to get started!</p>
      </div>
    );
  }

  return (
    <div className='h-full w-full bg-gray-100 p-12 grid grid-cols-6 gap-12'>
      {documents.map((document) => (
        <DocCard key={document.id} document={document} />
      ))}
    </div>
  );
};

export default DocsDisplay;
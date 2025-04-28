import React from 'react'
import { MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Document {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  s3_object_key: string;
  user_id: string;
}

const DocCard = ({ document }: { document: Document }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      
      if (diffHrs < 24) {
        if (diffHrs < 1) {
          const diffMins = Math.round(diffMs / (1000 * 60));
          return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        }
        const hours = Math.floor(diffHrs);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else if (diffHrs < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  const handleCardClick = () => {
    router.push(`/document/${document.id}`);
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the options button
    e.stopPropagation();
    // Handle options menu (future implementation)
    console.log('Options clicked for document:', document.id);
  };

  return (
    <div 
      className='bg-white h-[240px] w-[210px] shadow-sm flex flex-col overflow-hidden cursor-pointer hover:shadow-md'
      onClick={handleCardClick}
    >
      <div className='flex-1 p-4 border-b text-xs text-gray-600 overflow-hidden'>
        <div className='text-xs font-normal'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </div>
      </div>
      <div className='p-3'>
        <div className='flex items-center justify-between'>
          <div className='flex-col items-center gap-2'>
            <div className='text-sm font-medium text-gray-800'>{document.title}</div>
            <div className='text-xs text-gray-500 mt-1'>Updated {formatDate(document.updated_at)}</div>
          </div>
          <div className='cursor-pointer rounded-full p-1 hover:bg-gray-100' onClick={handleOptionsClick}>
            <MoreVertical 
              size={16} 
              className='text-gray-500 cursor-pointer' 
              onClick={handleOptionsClick}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DocCard;
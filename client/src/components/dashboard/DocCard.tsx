import React from 'react'
import { MoreVertical } from 'lucide-react'

const DocCard = () => {
  return (
    <div className='bg-white h-[240px] w-[210px] shadow-sm flex flex-col overflow-hidden'>
      <div className='flex-1 p-4 border-b text-xs text-gray-600 overflow-hidden'>
        <div className='text-xs font-normal'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </div>
      </div>
      <div className='p-3'>
        <div className='flex items-center justify-between'>
          <div className='flex-col items-center gap-2'>
            <div className='text-sm font-medium text-gray-800'>Example Document</div>
            <div className='text-xs text-gray-500 mt-1'>Opened Apr 26, 2025</div>
          </div>
          <MoreVertical size={16} className='text-gray-500' />
        </div>
        
      </div>
    </div>
  )
}

export default DocCard
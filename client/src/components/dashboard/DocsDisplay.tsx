import React from 'react'
import DocCard from './DocCard'

const DocsDisplay = () => {
  return (
    <div className='h-full w-full bg-gray-100 p-12 grid grid-cols-6 gap-12'>
      <DocCard />
      <DocCard />
      <DocCard />
      <DocCard />
      <DocCard />
      <DocCard />

    </div>
  )
}

export default DocsDisplay
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <Link href="/login">
        <button className='bg-black text-white px-4 py-2 rounded-md cursor-pointer'>Log In</button>
      </Link>
    </div>
  )
}

export default Hero
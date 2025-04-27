import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen gap-2'>
      <Link href="/login">
        <button className='bg-black text-white px-4 py-2 rounded-md cursor-pointer'>Log In</button>
      </Link>
      <Link href="/signup">
        <button className='bg-black text-white px-4 py-2 rounded-md cursor-pointer'>Sign Up</button>
      </Link>
    </div>
  )
}

export default Hero
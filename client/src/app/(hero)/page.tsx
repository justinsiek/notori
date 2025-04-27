import Link from 'next/link'
import React from 'react'
import { Navbar } from '@/components/hero/NavBar'
const Hero = () => {
  return (
    <>
      <Navbar />
      <div className='flex justify-center items-center h-[3000px] w-screen gap-2'/>
    </>
  )
}

export default Hero
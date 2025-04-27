import Link from 'next/link'
import React from 'react'
import { Navbar } from '@/components/hero/NavBar'
import { TypingAnimation } from '@/components/hero/TypingAnimation'

const Hero = () => {
  return (
    <>
      <Navbar />
      <div className='flex justify-center items-center h-[3000px] w-screen gap-2'>
        <TypingAnimation phrases={[
                    "AI-powered writing assistant.",
                    "Distraction-free environment.",
                    "Professional formatting tools.",
                    "Smart suggestions as you type.",
                    "Version history and document tracking.",
                  ]} />
      </div>
    </>
  )
}

export default Hero
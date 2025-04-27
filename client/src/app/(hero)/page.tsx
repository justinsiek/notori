import React from 'react'
import { Navbar } from '@/components/hero/NavBar'
import { TypingAnimation } from '@/components/hero/TypingAnimation'
import { HeroText } from '@/components/hero/HeroText'
const Hero = () => {
  return (
    <>
      <Navbar />
      <div className='flex flex-col h-full w-screen'>
        <div className='flex flex-col justify-center items-center h-screen w-screen space-y-4'>
        <HeroText />
        <TypingAnimation phrases={[
                    "AI-powered writing assistant.",
                    "Smart suggestions as you type.",
                    "Version history and document tracking.",
                    "Distraction-free environment.",
                    "Professional formatting tools.",
                  ]} />
        </div>
        <div className='flex flex-col justify-center items-center h-screen w-screen gap-2'>
          <div className='flex flex-col justify-center items-center h-screen w-screen gap-2'>
            <h1>Features</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
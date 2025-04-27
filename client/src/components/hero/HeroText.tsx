import React from 'react'
import { Inter, Cormorant_Garamond } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  style: 'italic',
  weight: '700' // Using 300 for a light, elegant feel
})


export const HeroText = () => {
  return (
    <h1 className={`text-5xl md:text-7xl font-semibold text-black tracking-tight leading-tight ${inter.className}`}>
      Write better,{" "}
      <span className={`relative inline-block ${cormorant.className} px-4 skew-x-[-10deg] tracking-tighter`}>
        faster
      <span className="absolute bottom-1 left-0 w-full h-0.5 bg-black -translate-y-3"></span>
      </span>
    </h1>
  )
}


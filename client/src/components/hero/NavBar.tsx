"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tighter text-black">notori.ai</span>
          </div>
          <nav className="flex items-center space-x-10">
            <h1>Features</h1>
            <h1>How it works</h1>
            <h1>Pricing</h1>
          </nav>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-sm text-gray-800 hover:text-black">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-black text-white hover:bg-gray-900"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
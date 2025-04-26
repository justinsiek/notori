'use client'
import { useState } from 'react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    fetch(`http://localhost:8080/api/login?email=${email}&password=${password}`)
      .then(response => response.json())
      .then(data => console.log(data))
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen w-screen gap-2'>
      <input className='border-2 border-gray-500 px-2' type="text" placeholder='Email' 
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className='border-2 border-gray-500 px-2' type="password" placeholder='Password' 
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className='bg-black text-white px-4 py-1 cursor-pointer' onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginForm
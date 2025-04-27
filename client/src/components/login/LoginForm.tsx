'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setError(null)
    setIsLoading(true)

    if (!email || !password) {
      setError('Please enter both email and password.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        console.error('Login failed:', response.status, data)
        setError(data.message || `Login failed (Status: ${response.status})`)
      } else {
        console.log('Login successful')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Network or other error during login:', err)
      setError('An error occurred connecting to the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen w-screen'>
      <div className="w-full max-w-md bg-white p-8 border-2 border-gray-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <input
          className='border-2 border-gray-500 px-3 py-2 w-full mb-3'
          type="email"
          placeholder='Email Address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input
          className='border-2 border-gray-500 px-3 py-2 w-full mb-4'
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <button
          className={`w-full text-white px-4 py-2 cursor-pointer ${isLoading ? 'bg-gra-800 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>

        {error && <p className='text-red-600 mt-4 text-sm text-center'>{error}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-black hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
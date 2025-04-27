'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleSignup = async () => {
    setError(null) 
    setMessage(null)

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    // email check
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Signup failed:', response.status, data)
        setError(data.message || `Signup failed (Status: ${response.status})`)
      } else {
        console.log('Signup successful:', data)
        setMessage(data.message || 'Signup successful! You can now log in.')
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Network or other error during signup:', err)
      setError('An error occurred connecting to the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen w-screen'>
       <div className="w-full max-w-md bg-white p-8 border-2 border-gray-500">
          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
          <input
              className='border-2 border-gray-500 px-3 py-2 w-full mb-3'
              type="email"
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
          />
          <input
              className='border-2 border-gray-500 px-3 py-2 w-full mb-3'
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
          />
           <input
              className='border-2 border-gray-500 px-3 py-2 w-full mb-3'
              type="password"
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
          />
          <button
              className={`w-full text-white px-4 py-2 cursor-pointer  ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-700'}`}
              onClick={handleSignup}
              disabled={isLoading}
          >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {error && <p className='text-red-600 mt-4 text-sm text-center'>{error}</p>}
          {message && <p className='text-green-600 mt-4 text-sm text-center'>{message}</p>}

          <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-black hover:underline">
                  Log In
              </a>
          </p>
      </div>
    </div>
  )
}

export default SignupForm
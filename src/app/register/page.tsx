'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { isValidUsername } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import Loader from '@/components/custom/loading'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, user, loading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/challenges')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validasi username
    const usernameError = isValidUsername(formData.username)
    if (usernameError) {
      setError(usernameError)
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { user, error } = await signUp(
        formData.email,
        formData.password,
        formData.username
      )

      if (error) {
        setError(error)
      } else if (user) {
        setUser(user)
        router.push('/challenges')
      }
    } catch {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (authLoading) {
    return <Loader fullscreen color="text-orange-500" />
  }

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8"
      >
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Register for CTFS
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Or{' '}
          <Link
            href="/login"
            className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
          >
            sign in with an existing account
          </Link>
        </p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-primary-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>

          <GoogleLoginButton />
        </form>
      </motion.div>
    </div>
  )
}

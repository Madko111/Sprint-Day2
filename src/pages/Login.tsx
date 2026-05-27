import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../index.css'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/app')
    }
  }

  return (
    <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="icon-gradient" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
            <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue your productivity journey</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div className="alert alert-error">
                <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <Link to="/forgot-password" style={{ color: 'var(--blue-500)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--blue-500)', textDecoration: 'none', fontWeight: 600 }}>
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

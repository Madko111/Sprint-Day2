import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../index.css'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Reset password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a reset link</p>
        </div>

        <div className="card">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                Check your email for a password reset link.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', textDecoration: 'none' }}>
                Back to login
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.875rem' }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>

              <Link to="/login" style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

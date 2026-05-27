import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../index.css'

export function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
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
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>New password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your new password</p>
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
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                New password
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
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>At least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

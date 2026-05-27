import { useState, useRef, useEffect } from 'react'

type SortBy = 'created' | 'due'

interface SortMenuProps {
  currentSort: SortBy
  onChange: (sort: SortBy) => void
}

export function SortMenu({ currentSort, onChange }: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getSortLabel = (sort: SortBy) => {
    switch (sort) {
      case 'created': return 'Sort by created'
      case 'due': return 'Sort by due date'
    }
  }

  const handleSelect = (sort: SortBy) => {
    onChange(sort)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', zIndex: 1000 }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="select"
        style={{
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '2rem',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backdropFilter: 'blur(10px)',
          paddingRight: '2.5rem',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='rgba(255,255,255,0.5)' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem'
        }}
      >
        {getSortLabel(currentSort)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '1.5rem',
            padding: '0.5rem',
            minWidth: '200px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
            animation: 'slideDown 0.2s ease'
          }}
        >
          {(['created', 'due'] as SortBy[]).map((sort) => {
            const isSelected = sort === currentSort

            return (
              <button
                type="button"
                key={sort}
                onClick={() => handleSelect(sort)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                  borderRadius: '1rem',
                  color: isSelected ? 'var(--blue-400)' : 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = 'white'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                {getSortLabel(sort)}
                {isSelected && (
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

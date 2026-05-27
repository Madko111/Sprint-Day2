import { useState, useRef, useEffect } from 'react'

type Priority = 'low' | 'med' | 'high'

interface PriorityMenuProps {
  currentPriority: Priority
  onChange: (priority: Priority) => void
}

export function PriorityMenu({ currentPriority, onChange }: PriorityMenuProps) {
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

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'High'
      case 'med': return 'Medium'
      case 'low': return 'Low'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return { bg: 'rgba(251, 146, 60, 0.2)', border: 'rgba(251, 146, 60, 0.3)', text: 'var(--amber-400)' }
      case 'med': return { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.3)', text: 'var(--purple-400)' }
      case 'low': return { bg: 'rgba(34, 211, 238, 0.2)', border: 'rgba(34, 211, 238, 0.3)', text: 'var(--cyan-400)' }
    }
  }

  const currentColor = getPriorityColor(currentPriority)

  const handleSelect = (priority: Priority) => {
    onChange(priority)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', zIndex: 1000 }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem 0.75rem',
          background: currentColor.bg,
          border: `1px solid ${currentColor.border}`,
          borderRadius: '1.5rem',
          color: currentColor.text,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {getPriorityLabel(currentPriority)}
        <svg style={{ width: '0.75rem', height: '0.75rem', transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
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
            minWidth: '150px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
            animation: 'slideDown 0.2s ease'
          }}
        >
          {(['high', 'med', 'low'] as Priority[]).map((priority) => {
            const color = getPriorityColor(priority)
            const isSelected = priority === currentPriority

            return (
              <button
                type="button"
                key={priority}
                onClick={() => handleSelect(priority)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isSelected ? color.bg : 'transparent',
                  border: `1px solid ${isSelected ? color.border : 'transparent'}`,
                  borderRadius: '1rem',
                  color: isSelected ? color.text : 'var(--text-secondary)',
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
                {getPriorityLabel(priority)}
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

import type { Todo } from '../lib/supabase'

interface StatsProps {
  todos: Todo[]
}

export function Stats({ todos }: StatsProps) {
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const highPriority = todos.filter(t => t.priority === 'high').length
  const medPriority = todos.filter(t => t.priority === 'med').length
  const lowPriority = todos.filter(t => t.priority === 'low').length

  const highCompleted = todos.filter(t => t.priority === 'high' && t.completed).length
  const medCompleted = todos.filter(t => t.priority === 'med' && t.completed).length
  const lowCompleted = todos.filter(t => t.priority === 'low' && t.completed).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Tasks</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{total}</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue-500)' }}>{active}</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--green-400)' }}>{completed}</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Completion Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--purple-500)' }}>{completionRate}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Overall Progress</div>
        <div style={{ width: '100%', height: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ 
            width: `${completionRate}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--blue-500) 0%, var(--purple-600) 100%)',
            transition: 'width 0.3s ease',
            borderRadius: 'var(--radius-full)'
          }}></div>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {completed} of {total} tasks completed
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Priority Breakdown</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* High Priority */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                High Priority
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {highCompleted}/{highPriority}
              </span>
            </div>
            <div style={{ width: '100%', height: '0.5rem', background: 'rgba(251, 146, 60, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ 
                width: highPriority > 0 ? `${(highCompleted / highPriority) * 100}%` : '0%', 
                height: '100%', 
                background: 'var(--orange-500)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* Medium Priority */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Medium Priority
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {medCompleted}/{medPriority}
              </span>
            </div>
            <div style={{ width: '100%', height: '0.5rem', background: 'rgba(168, 85, 247, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ 
                width: medPriority > 0 ? `${(medCompleted / medPriority) * 100}%` : '0%', 
                height: '100%', 
                background: 'var(--purple-500)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* Low Priority */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Low Priority
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {lowCompleted}/{lowPriority}
              </span>
            </div>
            <div style={{ width: '100%', height: '0.5rem', background: 'rgba(34, 211, 238, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ 
                width: lowPriority > 0 ? `${(lowCompleted / lowPriority) * 100}%` : '0%', 
                height: '100%', 
                background: 'var(--cyan-500)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution Chart */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Priority Distribution</div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px' }}>
          {/* High Priority Bar */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--orange-400)' }}>{highPriority}</div>
            <div style={{ 
              width: '100%', 
              height: total > 0 ? `${(highPriority / total) * 100}%` : '10%',
              minHeight: '20px',
              background: 'linear-gradient(180deg, var(--orange-400) 0%, var(--orange-500) 100%)',
              borderRadius: '1rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High</div>
          </div>

          {/* Medium Priority Bar */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--purple-500)' }}>{medPriority}</div>
            <div style={{ 
              width: '100%', 
              height: total > 0 ? `${(medPriority / total) * 100}%` : '10%',
              minHeight: '20px',
              background: 'linear-gradient(180deg, var(--purple-500) 0%, var(--purple-600) 100%)',
              borderRadius: '1rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Medium</div>
          </div>

          {/* Low Priority Bar */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cyan-400)' }}>{lowPriority}</div>
            <div style={{ 
              width: '100%', 
              height: total > 0 ? `${(lowPriority / total) * 100}%` : '10%',
              minHeight: '20px',
              background: 'linear-gradient(180deg, var(--cyan-400) 0%, var(--cyan-500) 100%)',
              borderRadius: '1rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Low</div>
          </div>
        </div>
      </div>
    </div>
  )
}

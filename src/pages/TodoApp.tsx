import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Todo } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Stats } from '../components/Stats'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PriorityMenu } from '../components/PriorityMenu'
import { FilterMenu } from '../components/FilterMenu'
import { SortMenu } from '../components/SortMenu'
import '../index.css'

type Filter = 'all' | 'active' | 'completed'
type Priority = 'low' | 'med' | 'high'
type SortBy = 'created' | 'due'
type Tab = 'tasks' | 'analytics'

export function TodoApp() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('created')
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('tasks')
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('med')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; todoId: string; todoTitle: string }>({
    isOpen: false,
    todoId: '',
    todoTitle: ''
  })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error)
    } else {
      setTodos(data || [])
    }
    setLoading(false)
  }

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !user) return

    const optimisticTodo: Todo = {
      id: crypto.randomUUID(),
      user_id: user.id,
      title: newTitle.trim(),
      description: null,
      due_date: null,
      priority: newTaskPriority,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTodos([optimisticTodo, ...todos])
    setNewTitle('')

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTitle.trim(), user_id: user.id, priority: newTaskPriority }])
      .select()
      .single()

    if (error) {
      console.error('Error adding todo:', error)
      setTodos(todos)
    } else if (data) {
      setTodos([data, ...todos])
    }
    
    setNewTaskPriority('med')
  }

  const handleToggle = async (id: string, completed: boolean) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t))

    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id)

    if (error) {
      console.error('Error toggling todo:', error)
      setTodos(todos.map(t => t.id === id ? { ...t, completed } : t))
    }
  }

  const handleDelete = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    setDeleteDialog({
      isOpen: true,
      todoId: id,
      todoTitle: todo.title
    })
  }

  const confirmDelete = async () => {
    const id = deleteDialog.todoId
    setDeleteDialog({ isOpen: false, todoId: '', todoTitle: '' })
    
    setTodos(todos.filter(t => t.id !== id))

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error)
      fetchTodos()
    }
  }

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, todoId: '', todoTitle: '' })
  }

  const handleEdit = async (id: string) => {
    if (!editTitle.trim()) return

    setTodos(todos.map(t => t.id === id ? { ...t, title: editTitle.trim() } : t))
    setEditingId(null)

    const { error } = await supabase
      .from('todos')
      .update({ title: editTitle.trim() })
      .eq('id', id)

    if (error) {
      console.error('Error updating todo:', error)
      fetchTodos()
    }
  }

  const handlePriorityChange = async (id: string, priority: Priority) => {
    setTodos(todos.map(t => t.id === id ? { ...t, priority } : t))

    const { error } = await supabase
      .from('todos')
      .update({ priority })
      .eq('id', id)

    if (error) {
      console.error('Error updating priority:', error)
      fetchTodos()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const filteredTodos = todos
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .sort((a, b) => {
      if (sortBy === 'due') {
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  if (loading) {
    return (
      <div className="gradient-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ marginBottom: '1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg">
      {/* Header */}
      <header className="glass" style={{ position: 'relative', zIndex: 10, borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '1.5rem', background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--purple-600) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-blue)' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>Todo App</h1>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {activeCount} active · {completedCount} done
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{ padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem' }}
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="container" style={{ display: 'flex', gap: '0.5rem', paddingTop: '0', paddingBottom: '0' }}>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`btn-filter ${activeTab === 'tasks' ? 'active' : ''}`}
            style={{ 
              borderRadius: '2rem 2rem 0 0', 
              borderBottom: 'none',
              paddingBottom: '1rem',
              background: activeTab === 'tasks' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`btn-filter ${activeTab === 'analytics' ? 'active' : ''}`}
            style={{ 
              borderRadius: '2rem 2rem 0 0', 
              borderBottom: 'none',
              paddingBottom: '1rem',
              background: activeTab === 'analytics' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </div>
      </header>

      <main className="container" style={{ position: 'relative', zIndex: 'auto', paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '80rem' }}>
        {activeTab === 'tasks' ? (
          <>
            {/* Quick Add */}
            <form onSubmit={handleAddTodo} style={{ marginBottom: '2rem', position: 'relative', zIndex: 100 }}>
              <div className="glass glass-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', borderRadius: '2rem', boxShadow: 'var(--shadow-lg)', transition: 'all 0.2s ease' }}>
                <button
                  type="button"
                  className="checkbox"
                />
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Add a task... (Press Enter)"
                  style={{ flex: 1, background: 'transparent', color: 'white', fontSize: '1rem', border: 'none', outline: 'none' }}
                />
                <PriorityMenu
                  currentPriority={newTaskPriority}
                  onChange={setNewTaskPriority}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--purple-500) 100%)',
                    border: 'none',
                    borderRadius: '1.5rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Add
                </button>
              </div>
            </form>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap', position: 'relative', zIndex: 50 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setFilter('all')}
                  className={`btn-filter ${filter === 'all' ? 'active' : ''}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`btn-filter ${filter === 'active' ? 'active' : ''}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`btn-filter ${filter === 'completed' ? 'active' : ''}`}
                >
                  Completed
                </button>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FilterMenu
                  currentFilter={priorityFilter}
                  onChange={setPriorityFilter}
                />

                <SortMenu
                  currentSort={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>

            {/* Task List */}
            {filteredTodos.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', backdropFilter: 'blur(20px)', border: '1px solid var(--border)' }}>
                  <svg style={{ width: '2.5rem', height: '2.5rem', color: 'var(--blue-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>All clear!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Add a task above to get started</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredTodos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className="glass glass-hover"
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '2rem', transition: 'all 0.2s ease', position: 'relative', zIndex: Math.max(1, 10 - index) }}
                  >
                    <button
                      onClick={() => handleToggle(todo.id, todo.completed)}
                      className={`checkbox ${todo.completed ? 'checked' : ''}`}
                    >
                      {todo.completed && (
                        <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleEdit(todo.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEdit(todo.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        className="input"
                        style={{ flex: 1, padding: '0.5rem 0.75rem' }}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditTitle(todo.title)
                        }}
                        style={{ flex: 1, fontSize: '1rem', cursor: 'pointer', color: todo.completed ? 'var(--text-tertiary)' : 'white', textDecoration: todo.completed ? 'line-through' : 'none', transition: 'color 0.2s ease' }}
                      >
                        {todo.title}
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <PriorityMenu
                        currentPriority={todo.priority}
                        onChange={(priority) => handlePriorityChange(todo.id, priority)}
                      />

                      <button
                        onClick={() => handleDelete(todo.id)}
                        style={{ padding: '0.5rem', color: 'var(--text-tertiary)', background: 'transparent', border: 'none', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--red-400)'
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-tertiary)'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Stats todos={todos} />
        )}
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteDialog.todoTitle}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

// Скрипт для создания тестового пользователя
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qdzohomlwlozyfolgaiv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkem9ob21sd2xvenlmb2xnYWl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg5OTk1OCwiZXhwIjoyMDk1NDc1OTU4fQ.XqFqhTk0dOmMQrn6a4oc8rx6liD2kvlDAHHz0ZyJAY4'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'demo@todoapp.com',
      password: 'demo123456',
      email_confirm: true
    })

    if (error) {
      console.error('Error:', error.message)
      return
    }

    console.log('✅ User created successfully!')
    console.log('Email: demo@todoapp.com')
    console.log('Password: demo123456')
    console.log('User ID:', data.user.id)

    // Создаём демо-задачи
    const todos = [
      { title: 'Design new landing page', priority: 'high', completed: false },
      { title: 'Review pull requests', priority: 'medium', completed: true },
      { title: 'Update documentation', priority: 'low', completed: false },
      { title: 'Fix responsive issues', priority: 'high', completed: true },
      { title: 'Prepare demo presentation', priority: 'medium', completed: false }
    ]

    for (const todo of todos) {
      await supabase
        .from('todos')
        .insert([{ ...todo, user_id: data.user.id }])
    }

    console.log('✅ Demo tasks created!')
    console.log('\nYou can now login at http://localhost:5173/login')
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

createTestUser()

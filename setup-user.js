// Скрипт для очистки и создания пользователя
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qdzohomlwlozyfolgaiv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkem9ob21sd2xvenlmb2xnYWl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg5OTk1OCwiZXhwIjoyMDk1NDc1OTU4fQ.XqFqhTk0dOmMQrn6a4oc8rx6liD2kvlDAHHz0ZyJAY4'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser() {
  try {
    console.log('Checking for existing users...')
    
    // Получаем список всех пользователей
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError.message)
      return
    }

    console.log(`Found ${users.users.length} existing users`)

    // Удаляем пользователя demo@todoapp.com если существует
    const existingUser = users.users.find(u => u.email === 'demo@todoapp.com')
    if (existingUser) {
      console.log('Deleting existing demo user...')
      await supabase.auth.admin.deleteUser(existingUser.id)
      console.log('✅ Old user deleted')
    }

    // Создаём нового пользователя
    console.log('Creating new user...')
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'demo@todoapp.com',
      password: 'demo123456',
      email_confirm: true,
      user_metadata: { name: 'Demo User' }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      return
    }

    console.log('✅ User created successfully!')
    console.log('📧 Email: demo@todoapp.com')
    console.log('🔑 Password: demo123456')
    console.log('🆔 User ID:', data.user.id)

    // Создаём демо-задачи
    console.log('\nCreating demo tasks...')
    const todos = [
      { title: 'Design new landing page', priority: 'high', completed: false },
      { title: 'Review pull requests', priority: 'medium', completed: true },
      { title: 'Update documentation', priority: 'low', completed: false },
      { title: 'Fix responsive issues', priority: 'high', completed: true },
      { title: 'Prepare demo presentation', priority: 'medium', completed: false },
      { title: 'Write unit tests', priority: 'medium', completed: false },
      { title: 'Deploy to production', priority: 'high', completed: false }
    ]

    for (const todo of todos) {
      const { error: todoError } = await supabase
        .from('todos')
        .insert([{ ...todo, user_id: data.user.id }])
      
      if (todoError) {
        console.error('Error creating todo:', todoError.message)
      }
    }

    console.log('✅ Demo tasks created!')
    console.log('\n🚀 You can now login at http://localhost:5173/login')
    console.log('📧 Email: demo@todoapp.com')
    console.log('🔑 Password: demo123456')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  }
}

createUser()

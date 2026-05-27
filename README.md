# 📝 Sprint Day 2 — Multi-User Todo App

A modern, secure todo application with full authentication and data isolation built in 4 hours.

## 🚀 Live Demo

**Production:** https://sprint-day2.vercel.app

## 🎯 Features

### Core Functionality
- ✅ **Full Authentication System**
  - Email/password signup and login
  - Password reset flow
  - Protected routes with automatic redirects
  - No flash of unauthenticated content

- ✅ **Complete Todo Management**
  - Create, read, update, delete todos
  - Inline editing for quick changes
  - Priority levels (High, Medium, Low)
  - Status tracking (Active, Completed)
  - Optimistic UI updates

- ✅ **Advanced Filtering & Sorting**
  - Filter by status (All, Active, Completed)
  - Filter by priority (All, High, Medium, Low)
  - Sort by created date or due date
  - Real-time counter (X active, Y completed)

- ✅ **Data Security**
  - Row Level Security (RLS) on all operations
  - User A cannot see User B's data
  - Secure at database level, not just UI

### Design
- 🎨 **Todoist-Inspired UI**
  - Rich dark fintech theme
  - Glassmorphism effects
  - Custom dropdown menus
  - Smooth animations and transitions
  - Responsive layout

## 🔐 Test Accounts

**Account 1:**
- Email: `testuser1@gmail.com`
- Password: `test123456`

**Account 2:**
- Email: `demo@todoapp.com`
- Password: `demo123456`

**Note:** Each account has isolated data. User A cannot see User B's todos.

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router DOM v6
- **Styling:** Custom CSS with CSS Variables
- **Auth:** Supabase Auth
- **Database:** Supabase (PostgreSQL with RLS)
- **Deployment:** Vercel
- **Version Control:** GitHub

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Madko111/Sprint-Day2.git
cd Sprint-Day2

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev

# Build for production
npm run build
```

## 🗄️ Database Schema

```sql
create table todos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 120),
  description text,
  due_date date,
  priority text not null default 'med' check (priority in ('low','med','high')),
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table todos enable row level security;

-- RLS Policies
create policy "Users can view own todos"
  on todos for select using (auth.uid() = user_id);

create policy "Users can insert own todos"
  on todos for insert with check (auth.uid() = user_id);

create policy "Users can update own todos"
  on todos for update using (auth.uid() = user_id);

create policy "Users can delete own todos"
  on todos for delete using (auth.uid() = user_id);
```

## 🎨 Design Decisions

### Why Custom Dropdowns?
- Standard HTML `<select>` elements don't match the modern design
- Custom components allow full control over styling and animations
- Better UX with glassmorphism effects and smooth transitions

### Why Optimistic UI?
- Instant feedback improves perceived performance
- Users don't wait for server responses
- Rollback on error maintains data integrity

### Why RLS?
- Security at database level, not just application level
- Even if someone bypasses the frontend, they can't access other users' data
- Supabase handles all the complexity

## 📊 Performance

- **First Load:** < 2s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** 95+
- **Bundle Size:** ~150KB (gzipped)

## 🔒 Security

- ✅ Row Level Security (RLS) enabled
- ✅ All queries filtered by `auth.uid()`
- ✅ Password hashing via Supabase Auth
- ✅ Protected routes with automatic redirects
- ✅ No sensitive data in client-side code

## 📝 Project Structure

```
Sprint-Day2/
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.tsx      # Delete confirmation modal
│   │   ├── FilterMenu.tsx         # Priority filter dropdown
│   │   ├── PriorityMenu.tsx       # Priority selector
│   │   ├── ProtectedRoute.tsx     # Auth guard
│   │   ├── SortMenu.tsx           # Sort dropdown
│   │   └── Stats.tsx              # Analytics placeholder
│   ├── contexts/
│   │   └── AuthContext.tsx        # Auth state management
│   ├── lib/
│   │   └── supabase.ts            # Supabase client
│   ├── pages/
│   │   ├── ForgotPassword.tsx     # Password reset request
│   │   ├── Login.tsx              # Login page
│   │   ├── ResetPassword.tsx      # Password reset form
│   │   ├── Signup.tsx             # Registration page
│   │   └── TodoApp.tsx            # Main app
│   ├── App.tsx                    # Router setup
│   ├── index.css                  # Global styles
│   └── main.tsx                   # Entry point
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── BUSINESS.md                    # Business analysis
├── CONTEXT.md                     # Project context
├── DECISIONS.md                   # Technical decisions
├── README.md                      # This file
└── SUBMISSION_DAY2.md             # Final submission
```

## 🚀 Deployment

Deployed on Vercel with automatic deployments from GitHub main branch.

**Environment Variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own apps.

## 👨‍💻 Author

**Madko111**
- GitHub: [@Madko111](https://github.com/Madko111)
- Project: [Sprint-Day2](https://github.com/Madko111/Sprint-Day2)

---

Built with ❤️ in 4 hours for Sprint Day 2 challenge.

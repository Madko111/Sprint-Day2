# 🧠 CONTEXT — Sprint Day 2

## 📅 Current Status
- **Date:** May 27, 2026
- **Project:** Sprint Day 2 — Todo App with Auth
- **Deadline:** Tuesday 23:59
- **Time Budget:** 30 minutes total (FAST!)
- **User:** Madko111

---

## 🎯 Day 2 Task Summary

**Build:** Multi-user todo app with full auth and RLS-isolated data

**Key Requirements:**
- Supabase Auth (email+password + magic link)
- Pages: /login, /signup, /forgot-password, /reset-password, /app
- Protected routes (redirect to /login if no session)
- CRUD todos: create, list, edit, toggle complete, delete
- Filters: status, priority
- Sort: by due date, created date
- RLS: User A cannot see User B's data
- Optimistic UI
- No flash of unauthenticated content

**Design:** 
- **Todoist-like UI** (https://www.todoist.com/ru)
- **Colors:** Rich dark fintech theme
- Clean, modern, premium

---

## 📊 Day 1 Completed

**Project:** Stacklet Landing Page
- **Live:** https://sprint-day1.vercel.app
- **GitHub:** https://github.com/Madko111/Sprint-Day1
- **Tech:** React 18, TypeScript, Vite, Tailwind CSS v4, Supabase
- **Design:** Clean dark background (#0a0e27), subtle gradients, premium spacing
- **Features:** Waitlist form, business analysis, full documentation
- **Status:** ✅ Submitted

**Key Learnings:**
- Subtle gradients (white/5 to transparent) on cards only
- Clean solid background, no harsh boundaries
- Generous spacing (py-32, px-20, max-w-1400px)
- Clickable logo returns to top
- RLS policies for data isolation

---

## 🗄️ Supabase Setup (Day 2)

### Database Schema:
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

-- RLS policies
alter table todos enable row level security;

create policy "Users can view own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can insert own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete own todos"
  on todos for delete
  using (auth.uid() = user_id);
```

### Auth Setup:
- Enable Email provider in Supabase Dashboard
- Authentication → Providers → Email → Enable

### Environment Variables:
```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

---

## 🚀 Tech Stack (Day 2)

- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS (Todoist-inspired)
- **Auth:** Supabase Auth
- **Database:** Supabase (PostgreSQL with RLS)
- **Deployment:** Vercel
- **Version Control:** GitHub (https://github.com/Madko111/Sprint-Day2)

---

## 🎨 Design Guidelines

**Colors (Rich Dark Fintech):**
- Background: Deep dark blue/black (#0a0e27 or similar)
- Cards: Subtle gradients (white/5 to transparent)
- Accent: Blue/purple for primary actions
- Text: White/gray hierarchy
- Borders: Subtle white/10

**Layout:**
- Clean, spacious (like Todoist)
- Generous padding and margins
- Clear visual hierarchy
- Smooth transitions
- No clutter

**Components:**
- Inline editing for quick changes
- Modal for full editing
- Confirmation dialogs for destructive actions
- Empty states with helpful messages
- Loading states (optimistic UI)

---

## ⚡ Working Style

**Speed:** FAST execution, 30 minutes total
**Quality:** Production-ready code
**Communication:** Short, direct, no fluff
**Approach:** 
- Build quickly
- Test as we go
- No over-engineering
- Focus on requirements

---

## 📋 Acceptance Criteria

- ☐ User A cannot see User B's data (test with 2 accounts)
- ☐ No flash of unauthenticated content
- ☐ Password reset email works end-to-end
- ☐ Inline form validation, not browser alerts
- ☐ Optimistic UI on create/complete
- ☐ Filters and sorting work correctly
- ☐ Empty state displays when no todos
- ☐ Counter shows "X active, Y completed"

---

## 📦 Deliverables

1. **Working app** on Vercel
2. **GitHub repo** with clean code
3. **README.md** with 2 test accounts
4. **BUSINESS.md** — business analysis:
   - Target audience (who's underserved by Todoist/Notion?)
   - Activation moment (signup → keeper)
   - Pricing strategy (free vs $5 vs $15)
   - CAC and LTV estimates
5. **DECISIONS.md** — technical decisions
6. **SUBMISSION_DAY2.md** — final submission
7. **Demo video** (90 seconds)

---

## 🎬 Demo Video Script (90 sec)

- **10 sec:** "The wedge is X. The activation moment is Y."
- **40 sec:** Signup → first todo → filter/sort → complete
- **20 sec:** Log in as second user, prove isolation
- **20 sec:** "Pricing would be $X because… next I'd add Z."

---

## 🔥 Current Progress

**Status:** Project created, dependencies installing
**Next Steps:**
1. ⏸️ **WAITING:** User needs to provide Supabase credentials
2. Set up Supabase client
3. Create auth pages (/login, /signup, /forgot-password, /reset-password)
4. Build protected /app route with todo CRUD
5. Implement filters, sorting, optimistic UI
6. Style with Todoist-inspired design
7. Test with 2 accounts
8. Deploy to Vercel
9. Write documentation
10. Record demo video

---

## 💡 Key Reminders

- **Time pressure:** 30 minutes total — work FAST
- **Design reference:** Todoist (https://www.todoist.com/ru)
- **No Day 1 files:** This is a separate project
- **GitHub repo:** https://github.com/Madko111/Sprint-Day2
- **User preference:** Direct, fast, quality work

---

**When user provides Supabase credentials → Continue building immediately!** ⚡

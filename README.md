# Todo App - Modern Task Manager

## 🚀 Как создать тестового пользователя

### Способ 1: Через Supabase Dashboard (Рекомендуется)

1. Открой https://supabase.com/dashboard
2. Выбери проект: **qdzohomlwlozyfolgaiv**
3. Перейди в **Authentication** → **Users**
4. Нажми **Add user** → **Create new user**
5. Заполни:
   - Email: `demo@todoapp.com`
   - Password: `demo123456`
   - ✅ **Auto Confirm User** (важно!)
6. Нажми **Create user**

Теперь можешь войти на сайт с этими данными!

### Способ 2: Через регистрацию на сайте

1. Открой http://localhost:5173/signup
2. Введи email и пароль (минимум 6 символов)
3. Нажми Sign up
4. Если получишь "email rate limit exceeded" — подожди 1-2 минуты

---

## 📱 Что нового в приложении?

### 📋 Вкладка Tasks
- ✅ Добавление задач
- ✅ Фильтры: All / Active / Completed
- ✅ **Приоритеты с эмодзи:**
  - 🔴 **High (P1)** — Высокий приоритет (срочные задачи)
  - 🟡 **Medium (P2)** — Средний приоритет (обычные задачи)
  - 🔵 **Low (P3)** — Низкий приоритет (несрочные задачи)
- ✅ Изменение приоритета прямо в списке (dropdown)
- ✅ Inline редактирование (клик на задачу)
- ✅ Удаление задач

### 📊 Вкладка Analytics

#### Overview Cards:
- **Total Tasks** — всего задач
- **Active** — активные задачи
- **Completed** — завершённые задачи
- **Completion Rate** — процент выполнения

#### Overall Progress:
- Прогресс-бар с градиентом
- Показывает сколько задач выполнено

#### Priority Breakdown:
- Прогресс по каждому приоритету
- 🔴 High / 🟡 Medium / 🔵 Low
- Сколько выполнено из общего числа

#### Priority Distribution Chart:
- Столбчатая диаграмма
- Визуализация распределения задач по приоритетам
- Анимированные столбцы

---

## 🎨 Дизайн

✨ Градиентный фон с анимированными blur-эффектами  
✨ Glassmorphism (стеклянные карточки)  
✨ Градиентные кнопки и иконки  
✨ Круглые чекбоксы с градиентом  
✨ Цветные бейджи приоритетов  
✨ Плавные анимации и transitions  
✨ Современная типографика  

---

## 🛠 Технологии

- React + TypeScript
- Supabase (Auth + Database)
- Vite
- Чистый CSS (без Tailwind)

---

## 🏃 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Открой http://localhost:5173
```

---

## 🔧 Настройка Supabase

1. Создай проект на https://supabase.com
2. Скопируй URL и Anon Key
3. Создай файл `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Создай таблицу `todos`:

```sql
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  priority text default 'med' check (priority in ('low', 'med', 'high')),
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table todos enable row level security;

-- Policies
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

---

## 📝 Лицензия

MIT

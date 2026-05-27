-- Create test user in Supabase
-- Run this in Supabase SQL Editor

-- Note: You need to create users through Supabase Auth UI or API
-- This is just for reference

-- To create a test user:
-- 1. Go to Supabase Dashboard -> Authentication -> Users
-- 2. Click "Add user" -> "Create new user"
-- 3. Email: demo@todoapp.com
-- 4. Password: demo123456
-- 5. Auto Confirm User: YES

-- Or use this SQL to insert test todos for existing users:
INSERT INTO todos (user_id, title, priority, completed) VALUES
  ('YOUR_USER_ID_HERE', 'Design new landing page', 'high', false),
  ('YOUR_USER_ID_HERE', 'Review pull requests', 'med', true),
  ('YOUR_USER_ID_HERE', 'Update documentation', 'low', false),
  ('YOUR_USER_ID_HERE', 'Fix responsive issues', 'high', true),
  ('YOUR_USER_ID_HERE', 'Prepare demo presentation', 'med', false);

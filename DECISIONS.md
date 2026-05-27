# 🛠️ Technical Decisions — Sprint Day 2

## 🎯 Architecture Decisions

### 1. Frontend Framework: React + TypeScript + Vite

**Decision:** Use React 18 with TypeScript and Vite as the build tool.

**Reasoning:**
- **React 18:** Industry standard, large ecosystem, excellent for SPAs
- **TypeScript:** Type safety prevents bugs, better IDE support, self-documenting code
- **Vite:** Lightning-fast HMR, modern build tool, better DX than CRA

**Alternatives Considered:**
- Next.js: Overkill for SPA, adds complexity
- Vue/Svelte: Less familiar, smaller ecosystem
- Plain JavaScript: No type safety, more bugs

**Trade-offs:**
- ✅ Fast development, great DX
- ✅ Type safety catches bugs early
- ❌ Slightly larger bundle than vanilla JS
- ❌ Learning curve for TypeScript

---

### 2. Authentication: Supabase Auth

**Decision:** Use Supabase Auth instead of building custom auth.

**Reasoning:**
- **Time constraint:** 4 hours total, can't build secure auth from scratch
- **Security:** Supabase handles password hashing, JWT tokens, session management
- **Features:** Email/password, magic links, OAuth ready out of the box
- **Free tier:** Generous limits for MVP

**Alternatives Considered:**
- Custom auth with bcrypt + JWT: Too time-consuming, security risks
- Firebase Auth: More expensive, vendor lock-in
- Auth0: Overkill for MVP, complex setup

**Trade-offs:**
- ✅ Secure, battle-tested
- ✅ Fast implementation (< 30 min)
- ✅ Free tier sufficient
- ❌ Vendor lock-in to Supabase
- ❌ Less control over auth flow

---

### 3. Database: Supabase (PostgreSQL with RLS)

**Decision:** Use Supabase PostgreSQL with Row Level Security.

**Reasoning:**
- **RLS:** Database-level security, not just application-level
- **Real-time:** Built-in subscriptions for live updates (future feature)
- **Type safety:** Auto-generated TypeScript types
- **Free tier:** 500MB database, 2GB bandwidth

**Alternatives Considered:**
- MongoDB: No RLS, less secure for multi-tenant
- Firebase Firestore: More expensive, less flexible queries
- Custom PostgreSQL: Need to manage hosting, backups

**Trade-offs:**
- ✅ RLS ensures data isolation
- ✅ SQL for complex queries
- ✅ Free tier sufficient
- ❌ Vendor lock-in
- ❌ Cold starts on free tier

---

### 4. Styling: Custom CSS with CSS Variables

**Decision:** Use custom CSS instead of Tailwind or CSS-in-JS.

**Reasoning:**
- **Performance:** No runtime overhead, smaller bundle
- **Control:** Full control over animations, glassmorphism effects
- **Simplicity:** No build step for CSS, easy to understand
- **CSS Variables:** Easy theming, dynamic colors

**Alternatives Considered:**
- Tailwind CSS: Verbose HTML, harder to customize glassmorphism
- Styled Components: Runtime overhead, larger bundle
- CSS Modules: Extra complexity for small project

**Trade-offs:**
- ✅ Best performance
- ✅ Full control over design
- ✅ Easy to customize
- ❌ More CSS to write
- ❌ No utility classes

---

### 5. State Management: React Context + useState

**Decision:** Use React Context for auth, useState for local state.

**Reasoning:**
- **Simplicity:** No external library needed
- **Sufficient:** App is small, no complex state
- **Performance:** Context only for auth (rarely changes)

**Alternatives Considered:**
- Redux: Overkill for small app, boilerplate
- Zustand: Extra dependency, not needed
- Jotai/Recoil: Too new, less stable

**Trade-offs:**
- ✅ Simple, no boilerplate
- ✅ No extra dependencies
- ✅ Easy to understand
- ❌ Context re-renders all consumers
- ❌ No devtools

---

### 6. Routing: React Router DOM v6

**Decision:** Use React Router DOM for client-side routing.

**Reasoning:**
- **Industry standard:** Most popular React router
- **Protected routes:** Easy to implement auth guards
- **Type-safe:** Works well with TypeScript

**Alternatives Considered:**
- TanStack Router: Too new, less stable
- Wouter: Too minimal, missing features
- Next.js: Overkill for SPA

**Trade-offs:**
- ✅ Battle-tested, stable
- ✅ Great documentation
- ✅ Protected routes easy
- ❌ Slightly verbose API
- ❌ No built-in data loading

---

### 7. UI Components: Custom Components

**Decision:** Build custom dropdown menus instead of using HTML select.

**Reasoning:**
- **Design:** HTML select can't be styled to match glassmorphism design
- **UX:** Custom components allow animations, better interactions
- **Control:** Full control over behavior, keyboard navigation

**Alternatives Considered:**
- HTML select: Can't style properly, looks dated
- Headless UI: Extra dependency, overkill
- Radix UI: Too heavy for 3 dropdowns

**Trade-offs:**
- ✅ Perfect design match
- ✅ Smooth animations
- ✅ No dependencies
- ❌ More code to write
- ❌ Need to handle accessibility

---

### 8. Optimistic UI Updates

**Decision:** Update UI immediately, rollback on error.

**Reasoning:**
- **UX:** Instant feedback, feels faster
- **Perception:** Users don't wait for server
- **Simple:** Easy to implement with useState

**Alternatives Considered:**
- Wait for server: Feels slow, bad UX
- Pessimistic UI: Loading spinners everywhere

**Trade-offs:**
- ✅ Feels instant
- ✅ Better UX
- ✅ Simple implementation
- ❌ Need rollback logic
- ❌ Can show stale data briefly

---

### 9. Deployment: Vercel

**Decision:** Deploy on Vercel with automatic GitHub deployments.

**Reasoning:**
- **Zero config:** Works with Vite out of the box
- **Fast:** Edge network, instant deployments
- **Free tier:** Generous limits for hobby projects
- **GitHub integration:** Auto-deploy on push

**Alternatives Considered:**
- Netlify: Similar, but Vercel has better Vite support
- Railway: More expensive, overkill for frontend
- AWS S3 + CloudFront: Too complex to set up

**Trade-offs:**
- ✅ Zero config
- ✅ Fast deployments
- ✅ Free tier sufficient
- ❌ Vendor lock-in
- ❌ Cold starts on free tier

---

### 10. Type Safety: Strict TypeScript

**Decision:** Use strict TypeScript with verbatimModuleSyntax.

**Reasoning:**
- **Catch bugs early:** Type errors at compile time
- **Better IDE support:** Autocomplete, refactoring
- **Self-documenting:** Types serve as documentation

**Trade-offs:**
- ✅ Fewer runtime bugs
- ✅ Better DX
- ✅ Easier refactoring
- ❌ More verbose code
- ❌ Learning curve

---

## 🔒 Security Decisions

### 1. Row Level Security (RLS)

**Decision:** Enable RLS on all tables, enforce at database level.

**Why:** Even if someone bypasses the frontend, they can't access other users' data.

### 2. No Sensitive Data in Client

**Decision:** Never store passwords, tokens, or sensitive data in client-side code.

**Why:** Client code can be inspected, decompiled, or modified.

### 3. Protected Routes

**Decision:** Redirect unauthenticated users to /login automatically.

**Why:** Prevents flash of unauthenticated content, better UX.

---

## 📊 Performance Decisions

### 1. Code Splitting

**Decision:** Use React.lazy for route-based code splitting.

**Why:** Smaller initial bundle, faster first load.

### 2. Optimistic UI

**Decision:** Update UI before server confirms.

**Why:** Feels instant, better perceived performance.

### 3. CSS Variables

**Decision:** Use CSS variables for theming instead of inline styles.

**Why:** Better performance, easier to maintain.

---

## 🎨 Design Decisions

### 1. Glassmorphism

**Decision:** Use glassmorphism effects (blur, transparency) for modern look.

**Why:** Matches Todoist aesthetic, feels premium.

### 2. Dark Theme Only

**Decision:** Only dark theme for MVP.

**Why:** Time constraint, dark theme is more popular for productivity apps.

### 3. Custom Dropdowns

**Decision:** Build custom dropdowns instead of using HTML select.

**Why:** HTML select can't be styled to match glassmorphism design.

---

## 🚀 Future Improvements

### Short Term (Next 2 weeks)
1. **Light theme toggle**
2. **Due date reminders** (email + push)
3. **Recurring tasks**
4. **Mobile app** (React Native)

### Medium Term (Next 1-2 months)
1. **Team collaboration**
2. **Subtasks**
3. **Tags**
4. **Search**

### Long Term (Next 3-6 months)
1. **Calendar view**
2. **Integrations** (Google Calendar, Slack)
3. **API**
4. **Custom themes**

---

**Built with 🛠️ careful technical decisions and ⚡ speed.**

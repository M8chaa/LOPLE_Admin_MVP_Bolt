# MVP Development To-Do List

## Legend
- [ ] Task not started
- [>] Task in progress
- [x] Task completed

## Tasks

### 1. Project Setup
1.1 [x] Decide tech stack and folder structure
1.2 [x] Initialize backend (Node.js + Express + SQLite via Sequelize)
1.3 [x] Initialize frontend (Vite + React + TypeScript + MUI)

### 2. Backend – Core Logic
2.1 [x] Create DB models: User, Driver, Callcard
2.2 [x] Implement JWT authentication (login route)
2.3 [x] Implement CRUD routes for Callcards
2.4 [x] Implement Driver list & status routes
2.5 [x] Implement assign/unassign driver to callcard
2.6 [x] Seed database with sample data

### 3. Frontend – Core UI
3.1 [x] Build login page (token storage)
3.2 [x] Build protected layout & routing
3.3 [x] Build Callcard list page with CRUD & assign driver modal
3.4 [x] Build Driver list page
3.5 [x] Build basic dashboard summary panel

### 4. Integration & Testing
4.1 [x] Connect frontend to backend APIs
4.2 [x] Verify auth flow & protected routes
4.3 [x] Verify callcard CRUD and driver assignment interactions

### 5. Deployment & Docs
5.1 [x] Add README with setup/run instructions
5.2 [x] Ensure npm scripts for dev and prod

### Next Up
- MVP ready for tomorrow's briefing. Further polishing can be done post-demo.

### MVP Scope Note (from PRD)
- Included: Auth login, basic dashboard KPIs, callcard CRUD + driver assignment, driver list & status.
- Excluded for MVP: Cancel/Accident/Return workflows, price engine, analytics, maps, batch operations, multi-role UI, notifications, electronic docs.
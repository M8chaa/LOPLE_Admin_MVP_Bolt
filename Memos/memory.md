## Project Memory Log

- Decided MVP tech stack:
  - Backend: Node.js, Express, SQLite (via Sequelize ORM), JWT for auth.
  - Frontend: React (Vite), TypeScript, Material-UI (MUI) for quick admin UI.
- Core domain entities identified for MVP: User (admin), Driver, Callcard (with basic fields + status + driver assignment).
- Focus: Simple yet functional core logic (auth, callcard CRUD, driver list, assignment) per PRD.
- Notes: Use PRD reference for naming and flows; no map or advanced features in MVP.
- MVP core backend and frontend implemented with essential features: login, dashboard, callcards CRUD & driver assignment.
- Verified API endpoints and basic interactions via curl (login, list callcards, driver assignment/unassignment) – all working.
- Vite dev server running and index page served successfully (frontend compile OK).
- Implementation aligns with core PRD requirements for MVP: auth, callcard management, driver assignment, basic dashboard.
- Tech stack rationale:
  * Node.js + Express chosen for rapid prototyping and abundant middleware ecosystem.
  * SQLite via Sequelize for zero-config persistence, easy file DB suited for MVP demos; can migrate to Postgres later.
  * JWT auth keeps backend stateless; aligns with PRD's RBAC need (roles can be extended via token claims later).
  * React + Vite + TS offers fast HMR and type safety; Material-UI accelerates admin UI components and theming.
  * Axios for REST calls; Playwright added for e2e browser tests to ensure flows (login, dashboard render, callcard assignment) work.
  * Folder split into `server` and `client` keeps clear separation for future micro-service or Next.js migration.
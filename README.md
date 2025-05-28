# LOPLE Admin MVP

This repository contains a minimal MVP implementation of the LOPLE Admin Site, covering the essential logic for demonstration purposes.

## Tech Stack

| Layer    | Tech |
|----------|------|
| Backend  | Node.js, Express, SQLite (Sequelize), JWT |
| Frontend | React (Vite + TypeScript), Material-UI, Axios |

## Features Implemented

* Secure login (JWT)
* Dashboard with simple KPIs (callcards & drivers)
* Callcard list with CRUD and driver assignment / unassignment
* Driver list with status display

## Getting Started

### Prerequisites
* Node.js 18+

### 1. Backend

```bash
cd server
npm install
npm run dev # starts on port 4000
```
The first run seeds an `admin / admin123` user, two sample drivers and two sample callcards into `database.sqlite`.

### 2. Frontend

```bash
cd client
npm install
npm run dev # starts on port 5173
```

Open http://localhost:5173 and log in with the seeded credentials above.

## Folder Structure (excerpt)
```
server/
  models/
  routes/
  seed.js
client/
  src/
    pages/
    hooks/
```

## Next Steps
* Add maps, notifications, advanced filters, and full role management as described in the PRD.
* Write unit & e2e tests and integrate CI/CD pipeline.

---
MVP built overnight for stakeholder briefing ☕️🚀
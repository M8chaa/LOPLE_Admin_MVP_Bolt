# LOPLE Admin MVP - Production Setup Guide

## ⚠️ CRITICAL: Repository Fix Applied
**The repository has been cleaned to remove inappropriate tracking of files that should be ignored.**

### What Was Fixed:
- Removed all `node_modules/` directories from git tracking (were causing 100MB+ repository bloat)
- Removed log files (`server.log`, `client.log`) from tracking
- Removed database file (`database.sqlite`) from tracking
- Added comprehensive `.gitignore` file covering Node.js, React, and build artifacts

### ⚠️ Breaking Change Notice:
After pulling the latest changes, teams MUST run:
```bash
cd server && npm install
cd ../client && npm install
```

## Production Deployment Checklist

### 1. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd lople-admin-mvp

# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2. Environment Setup

#### Server Environment
Create `server/.env`:
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secure-jwt-secret-here
DATABASE_URL=./database.sqlite
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Client Environment
Create `client/.env.production`:
```env
VITE_API_URL=https://your-api-domain.com
```

### 3. Build Process
```bash
# Build client for production
cd client
npm run build

# The dist/ folder will contain optimized static files
```

### 4. Database Setup
```bash
# The database will be created automatically on first run
# Initial admin credentials: admin / admin123
# Change these immediately in production!
```

### 5. Start Production Servers

#### Server (Backend)
```bash
cd server
npm start  # or npm run start
```

#### Client (Frontend)
```bash
cd client
npm run preview  # For testing production build locally
# Or serve dist/ folder through nginx/apache in production
```

### 6. Production Considerations

#### Security
- [ ] Change default admin credentials (admin/admin123)
- [ ] Set strong JWT_SECRET in production
- [ ] Configure HTTPS for both frontend and backend
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting on API endpoints

#### Performance
- [ ] Configure nginx/apache reverse proxy for backend
- [ ] Serve frontend static files through CDN
- [ ] Set up database backups
- [ ] Configure logging (files will be ignored by git)

#### Monitoring
- [ ] Set up health check endpoints
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure log rotation

### 7. File Structure After Setup
```
lople-admin-mvp/
├── .gitignore                  # Comprehensive ignore rules
├── client/
│   ├── node_modules/          # Ignored by git
│   ├── dist/                  # Build output (ignored)
│   ├── src/                   # Source code
│   └── package.json
├── server/
│   ├── node_modules/          # Ignored by git
│   ├── database.sqlite        # Ignored by git (created at runtime)
│   ├── server.log            # Ignored by git (created at runtime)
│   ├── src/                  # Source code
│   └── package.json
└── Memos/                    # Documentation
```

### 8. Features Ready for Production

#### Authentication System
- JWT-based login
- Korean language support
- Session management

#### Dashboard
- Real-time KPIs
- Quick action buttons
- Activity monitoring

#### Callcard Management
- Full CRUD operations
- Driver assignment system
- Status tracking (대기중, 진행중, 완료, 취소)
- Korean route data

#### Driver Management
- Driver profiles with contact info
- Status management (대기중, 운송중, 오프라인)
- Vehicle information tracking

### 9. Demo Credentials
```
Username: admin
Password: admin123
```
**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION**

### 10. Port Configuration
- Backend API: http://localhost:4000
- Frontend Dev: http://localhost:5173
- Frontend Prod: Served through web server (nginx/apache)

### 11. Korean Localization
- Full Korean UI
- Korean sample data included
- Korean status labels throughout
- Korean error messages

### 12. Technology Stack
- **Backend**: Node.js + Express + SQLite + Sequelize + JWT
- **Frontend**: React 18 + TypeScript + Material-UI v5 + Vite
- **Database**: SQLite (production-ready for MVP scale)
- **Authentication**: JWT tokens with secure headers
- **Testing**: Playwright for E2E testing

This setup guide ensures proper production deployment while maintaining security best practices and performance optimization.
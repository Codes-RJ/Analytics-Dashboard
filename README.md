# Data Analytics Dashboard

A production-ready, fully customizable data analytics dashboard with drag-and-drop panels, multiple chart types, and support for large datasets.

## Features

- 📊 Interactive KPI cards with real metrics
- 📈 Multiple chart types (Line, Bar, Pie, Area, Scatter)
- 🎯 Drag-and-drop resizable panels
- 📁 Support for CSV, XLSX, SQL imports
- 🔍 Server-side pagination for 50k+ rows
- 📊 Advanced analytics (statistics, correlation, regression)
- 🔐 JWT authentication with role-based access
- 👑 Admin panel for user management
- 💾 Save/load custom dashboard layouts
- 🚀 Optimized performance with virtualization

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Analytics Engine**: FastAPI + Pandas/NumPy
- **Database**: PostgreSQL

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/analytics-dashboard.git
cd analytics-dashboard
```

2. Set up environment variables
```bash
cp backend/.env.example backend/.env
cp analytics-engine/.env.example analytics-engine/.env
cp frontend/.env.example frontend/.env
```

3. Start the database
```bash
# Using Docker
docker-compose up -d postgres
# Or use local PostgreSQL
createdb analytics
```

4. Run database migrations
```bash
cd backend
npx prisma migrate dev --name init
```

5. Install dependencies and start services
- Backend
```bash
cd backend
npm install
npm run dev
```

- Frontend
```bash
cd frontend
npm install
npm run dev
```

- Analytics Engine
```bash
cd analytics-engine
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

6. Open http://localhost:5173

### Deployment

## Production Build

# Backend:
```bash
cd backend
npm run build
npm start
```

# Frontend:

```bash
cd frontend
npm run build
# Serve the dist folder
```

## Docker Deployment
```bash
docker-compose up -d
```

### API Documentation
```bash
Once running, visit:
Backend API: http://localhost:5000/api
Analytics Engine: http://localhost:8000/docs
```

### License
```bash
MIT
---
### `.gitignore`
```

### Dependencies
node_modules/
pycache/
*.pyc
.python-version

### Environment files
.env
.env.local
.env.*.local

### Build outputs
dist/
build/
*.log

### Uploads
uploads/
*.csv
*.xlsx
*.xls
*.sql

### IDE
.vscode/
.idea/
*.swp
*.swo

### OS
.DS_Store
Thumbs.db
---

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: analytics
      POSTGRES_PASSWORD: analytics
      POSTGRES_DB: analytics
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://analytics:analytics@postgres:5432/analytics
      JWT_SECRET: your-secret-key
      ANALYTICS_ENGINE_URL: http://analytics-engine:8000
      CLIENT_ORIGIN: http://localhost:5173
    depends_on:
      - postgres
      - analytics-engine
    volumes:
      - ./backend/uploads:/app/uploads

  analytics-engine:
    build: ./analytics-engine
    ports:
      - "8000:8000"
    environment:
      ALLOWED_ORIGINS: http://localhost:5000
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
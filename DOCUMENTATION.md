# 📊 Analytics Dashboard - Complete Documentation

## Table of Contents
1.  [System Overview]                     (#system-overview)
2.  [Architecture]                        (#architecture)
3.  [Prerequisites]                       (#prerequisites)
4.  [Installation Guide]                  (#installation-guide)
5.  [Database Configuration (MySQL)]      (#database-configuration-mysql)
6.  [Environment Variables]               (#environment-variables)
7.  [Running the Application]             (#running-the-application)
8.  [VS Code Setup]                       (#vs-code-setup)
9.  [Features Guide]                      (#features-guide)
10. [API Documentation]                   (#api-documentation)
11. [Database Schema]                     (#database-schema)
12. [Troubleshooting]                     (#troubleshooting)
13. [Deployment]                          (#deployment)
14. [Customization Guide]                 (#customization-guide)

---------------------------------------------------------------------------------

## System Overview

The Analytics Dashboard is a full-stack web application that allows users to upload datasets, create visualizations, and perform advanced analytics. It supports files up to 50,000+ rows with virtualized tables for smooth performance.

### Key Features
- 📊 Interactive KPI cards with real metrics
- 📈 Multiple chart types (Line, Bar, Pie, Area, Scatter)
- 🎯 Drag-and-drop resizable panels
- 📁 Support for CSV, XLSX, SQL imports
- 🔍 Server-side pagination for large datasets
- 📊 Advanced analytics (statistics, correlation, regression)
- 🔐 JWT authentication with role-based access
- 👑 Admin panel for user management
- 💾 Save/load custom dashboard layouts

---------------------------------------------------------------------------------

## Architecture
+----------------------------------------------------------------------+
| ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐|
| │ Frontend        │ ---> │ Backend         │ ---> │ MySQL           │|
| │ React/Vite      │      │ Node/Express    │      │ Database        │|
| └─────────────────┘      └────────┬────────┘      └─────────────────┘|
|                                   │                                  |
|                                   ▼                                  |
|                           ┌─────────────────┐                        |
|                           │ Analytics       │                        |
|                           │ Engine          │                        |
|                           │ FastAPI/Pandas  │                        |
|                           └─────────────────┘                        |
+----------------------------------------------------------------------+

---------------------------------------------------------------------------------


### Technology Stack
+------------------+------------------------------+---------------------------+
| Layer            | Technology                   | Purpose                   |
|------------------|------------------------------|---------------------------|
| Frontend         | React 18, Vite, Tailwind CSS | User Interface            |
| State Management | React Context + Hooks        | App State                 |
| Charts           | Recharts                     | Data Visualization        |
| Drag & Drop      | react-grid-layout            | Dashboard Layout          |
| Virtual Table    | react-virtual                | Large Dataset Performance |
| Backend          | Node.js, Express             | API Server                |
| Database         | MySQL                        | Data Storage              |
| ORM              | Prisma                       | Database Operations       |
| Auth             | JWT, bcrypt                  | Authentication            |
| Analytics        | FastAPI, Pandas              | Data Processing           |
| File Upload      | Multer                       | File Handling             |
+------------------+------------------------------+---------------------------+

---------------------------------------------------------------------------------

## Prerequisites

### Required Software
+----------+----------------+----------------------------------+
| Software | Version        | Download Link                    |
|----------|----------------|----------------------------------|
| Node.js  | 18.x or higher | [https://nodejs.org/]            |
| Python   | 3.9 or higher  | [https://python.org/]            |
| MySQL    | 8.0 or higher  | [https://mysql.com/]             |
| Git      | Latest         | [https://git-scm.com/]           |
| VS Code  | Latest         | [https://code.visualstudio.com/] |
+----------+----------------+----------------------------------+

### VS Code Extensions (Recommended)
```bash
# Install these extensions for best experience
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python
- Pylance
- Prisma
- vscode-icons
- MySQL
```

Installation Guide
Step 1: Clone or Create Project

# Create project directory
mkdir analytics-dashboard
cd analytics-dashboard

# Create folder structure (if not already done)
mkdir -p backend/{prisma/migrations,src/{controllers,middleware,routes,utils},uploads,logs}
mkdir -p analytics-engine/app/{routes,services,models,utils}
mkdir -p frontend/{public,src/{assets/{images,styles},components/{common,dashboard,forms,tables},pages,hooks,context,services,utils}}
mkdir -p .vscode

Step 2: Install Backend Dependencies

cd backend
npm init -y
npm install @prisma/client express cors dotenv bcryptjs jsonwebtoken cookie-parser helmet morgan express-rate-limit express-validator multer axios xlsx winston
npm install -D nodemon prisma
npx prisma init
cd ..

Step 3: Install Analytics Engine Dependencies

cd analytics-engine
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install fastapi uvicorn pandas numpy scikit-learn scipy openpyxl python-multipart pydantic python-dotenv
pip freeze > requirements.txt
cd ..

Step 4: Install Frontend Dependencies

cd frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios recharts react-grid-layout react-resizable react-table react-virtual react-dropzone react-hot-toast date-fns clsx zustand jwt-decode react-icons
npm install -D tailwindcss postcss autoprefixer @vitejs/plugin-react
npx tailwindcss init -p
cd ..
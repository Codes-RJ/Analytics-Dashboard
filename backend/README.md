# Backend Service - Analytics Dashboard

Node.js/Express backend with Prisma ORM for the Analytics Dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Run database migrations:
```bash
npx prisma migrate dev --name init
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

/api/auth - Authentication routes
/api/users - User management
/api/datasets - Dataset operations
/api/layouts - Dashboard layouts
/api/admin - Admin functions
/api/analytics - Analytics proxy

## Environment Variables
See .env.example for required variables.

### `backend/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String             @id @default(cuid())
  email            String             @unique
  password         String
  name             String?
  role             Role               @default(USER)
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  datasets         Dataset[]
  dashboardLayouts DashboardLayout[]
  logs             Log[]
}

model Dataset {
  id          String   @id @default(cuid())
  name        String
  description String?
  fileName    String
  filePath    String
  rowCount    Int
  columns     Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs        Log[]
}

model DashboardLayout {
  id        String   @id @default(cuid())
  name      String
  layout    Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Log {
  id        String   @id @default(cuid())
  action    String
  details   Json?
  createdAt DateTime @default(now())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  datasetId String?
  dataset   Dataset? @relation(fields: [datasetId], references: [id])

  @@index([userId])
  @@index([datasetId])
  @@index([createdAt])
}

enum Role {
  ADMIN
  USER
}
```
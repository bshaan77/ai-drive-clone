# Phase 1: Project Setup (2-3 hours)

**Goal**: Get a basic Next.js app running with authentication and database connection  
**Deliverable**: Working app with sign-in, basic layout, and database schema

## Tasks

### 1. Initialize Project (30 min)

- [x] Run `pnpm create t3-app@latest` with TypeScript, Tailwind, Drizzle, PostgreSQL
- [x] Install additional dependencies: `@clerk/nextjs`, `@vercel/blob`
- [ ] Set up environment variables (.env.local)
- [ ] Configure Tailwind CSS with custom theme colors
- [ ] Test that app runs without errors

### 2. Database Setup (30 min)

- [x] Create Neon PostgreSQL database (use PostgreSQL 15)
- [x] Update database connection string in .env
- [x] Create basic schema: users, files, folders, shares tables
- [x] Run database migrations
- [x] Test database connection

### 3. Authentication Setup (30 min)

- [x] Create Clerk application
- [x] Add Clerk environment variables
- [x] Create sign-in and sign-up pages using V0
- [x] Add authentication middleware
- [x] Test sign-in/sign-up flow

### 4. Basic Layout (45 min)

- [x] Use V0 to scaffold main layout (header, sidebar, content area)
- [x] Create responsive sidebar with navigation items
- [x] Add header with search placeholder and user menu
- [x] Create basic dashboard page
- [x] Test responsive layout on mobile/desktop

### 5. File Storage Setup (30 min)

- [x] Configure Vercel Blob Storage
- [x] Create basic file upload API endpoint
- [x] Test file upload functionality
- [x] Add file type detection
- [x] Create basic file storage utilities

## Success Criteria

- [x] App runs without errors
- [x] Users can sign up and sign in
- [x] Basic layout displays correctly
- [x] Database connection works
- [x] File upload endpoint accepts files

## Next Phase

Ready for basic file management features

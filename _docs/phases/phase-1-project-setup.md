# Phase 1: Project Setup (2-3 hours)

**Goal**: Get a basic Next.js app running with authentication and database connection  
**Deliverable**: Working app with sign-in, basic layout, and database schema

## Tasks

### 1. Initialize Project (30 min)

- [ ] Run `pnpm create t3-app@latest` with TypeScript, Tailwind, Drizzle, PostgreSQL
- [ ] Install additional dependencies: `@clerk/nextjs`, `@vercel/blob`
- [ ] Set up environment variables (.env.local)
- [ ] Configure Tailwind CSS with custom theme colors
- [ ] Test that app runs without errors

### 2. Database Setup (30 min)

- [ ] Create Neon PostgreSQL database
- [ ] Update database connection string in .env
- [ ] Create basic schema: users, files, folders, shares tables
- [ ] Run database migrations
- [ ] Test database connection

### 3. Authentication Setup (30 min)

- [ ] Create Clerk application
- [ ] Add Clerk environment variables
- [ ] Create sign-in and sign-up pages using V0
- [ ] Add authentication middleware
- [ ] Test sign-in/sign-up flow

### 4. Basic Layout (45 min)

- [ ] Use V0 to scaffold main layout (header, sidebar, content area)
- [ ] Create responsive sidebar with navigation items
- [ ] Add header with search placeholder and user menu
- [ ] Create basic dashboard page
- [ ] Test responsive layout on mobile/desktop

### 5. File Storage Setup (30 min)

- [ ] Configure Vercel Blob Storage
- [ ] Create basic file upload API endpoint
- [ ] Test file upload functionality
- [ ] Add file type detection
- [ ] Create basic file storage utilities

## Success Criteria

- [ ] App runs without errors
- [ ] Users can sign up and sign in
- [ ] Basic layout displays correctly
- [ ] Database connection works
- [ ] File upload endpoint accepts files

## Next Phase

Ready for basic file management features

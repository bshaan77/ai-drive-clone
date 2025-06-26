# Google Drive Clone

A modern, AI-first file management application built with the T3 stack. This project demonstrates how to build a fully functional Google Drive clone with advanced features and clean, maintainable code.

## 🎯 Project Overview

This is a learning project that showcases the development of a Google Drive clone, focusing on:

- **File & Folder Management**: Upload, download, organize, and manage files
- **User Authentication**: Secure user registration and login
- **File Sharing & Collaboration**: Share files with specific users and generate public links
- **Search & Discovery**: Efficient search capabilities with real-time results
- **Dashboard & Analytics**: User-friendly dashboard with file statistics
- **Mobile-First Design**: Responsive interface that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL 15 database (Neon recommended)
- Clerk account for authentication
- Vercel account for deployment

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/drive-tutorial-ishaan.git
   cd drive-tutorial-ishaan
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://..."

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."

   # File Storage (Vercel Blob)
   BLOB_READ_WRITE_TOKEN="..."
   ```

4. **Set up the database**

   ```bash
   pnpm db:push
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **V0** - AI-powered UI scaffolding

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Primary database (hosted on Neon)
- **Supabase** - Backend-as-a-Service with additional features

### Authentication & Storage

- **Clerk** - Complete authentication solution
- **Vercel Blob Storage** - Cloud file storage
- **Server-Sent Events** - Real-time updates

### Development & Deployment

- **pnpm** - Fast package manager
- **ESLint + Prettier** - Code quality and formatting
- **Vercel** - Deployment platform

## 📁 Project Structure

```
drive-tutorial-ishaan/
├── _docs/                          # Project documentation
│   ├── phases/                     # Development phases
│   │   ├── project-overview.md         # High-level project overview
│   │   ├── user-flow.md               # User journey documentation
│   │   ├── tech-stack.md              # Technology stack details
│   │   ├── ui-rules.md                # UI design principles
│   │   ├── theme-rules.md             # Design system and theming
│   │   └── project-rules.md           # Development conventions
│   ├── src/
│   │   ├── app/                       # Next.js App Router pages
│   │   │   ├── (auth)/               # Authentication routes
│   │   │   ├── (dashboard)/          # Protected dashboard routes
│   │   │   ├── api/                  # API routes
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── globals.css           # Global styles
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ui/                   # Shadcn/ui components
│   │   │   ├── layout/               # Layout components
│   │   │   ├── files/                # File-related components
│   │   │   ├── forms/                # Form components
│   │   │   └── feedback/             # User feedback components
│   │   ├── lib/                      # Utility libraries
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── types/                    # TypeScript type definitions
│   │   └── server/                   # Server-side code
│   ├── public/                       # Static assets
│   └── tests/                        # Test files
```

## 🎨 Design Philosophy

### Minimalistic Approach

Inspired by Notion and Grammarly, the design focuses on:

- **Content over decoration** - Clean, purposeful interfaces
- **Mobile-first design** - Touch-friendly interactions
- **Accessibility** - WCAG AA compliance
- **Performance** - Fast loading and smooth interactions

### UI/UX Principles

- **Clarity & Hierarchy** - Clear visual distinction between elements
- **Efficiency & Speed** - Quick actions and immediate feedback
- **Responsive & Adaptive** - Works seamlessly across all devices
- **Trust & Security** - Clear permissions and secure operations

## 🚀 Development Phases

The project follows a 3-4 day development cycle:

### Phase 1: Project Setup (2-3 hours)

- Initialize Next.js with T3 stack
- Set up authentication and database
- Create basic layout with V0
- Configure file storage

### Phase 2: File Upload & Display (3-4 hours)

- Drag-and-drop file upload
- File grid/list display
- File operations (download, rename, delete)
- Folder system

### Phase 3: Search & Sharing (3-4 hours)

- Real-time search functionality
- File sharing between users
- Public link sharing
- Shared files view

### Phase 4: Polish & Deploy (3-4 hours)

- UI polish and responsiveness
- File preview capabilities
- Dashboard and notifications
- Production deployment

## 📋 Development Conventions

### AI-First Codebase

- **Modularity** - Each file has a single, clear responsibility
- **Scalability** - Structure supports growth without refactoring
- **Readability** - Self-documenting code with clear naming
- **AI Compatibility** - Optimized for AI tool comprehension

### Code Standards

- **File Size Limit** - No file exceeds 500 lines
- **Descriptive Names** - Clear, descriptive file and function names
- **Documentation** - Every file has a header comment
- **JSDoc/TSDoc** - All functions have proper documentation
- **Consistent Structure** - Predictable file organization

### File Naming

- Use kebab-case for files and directories
- Avoid abbreviations unless universally understood
- Group by feature rather than type
- Examples: `file-card.tsx`, `upload-zone.tsx`, `search-results.tsx`

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Run end-to-end tests
pnpm test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📚 Documentation

- **[Project Overview](./_docs/project-overview.md)** - High-level project description
- **[User Flow](./_docs/user-flow.md)** - Complete user journey documentation
- **[Tech Stack](./_docs/tech-stack.md)** - Detailed technology stack
- **[UI Rules](./_docs/ui-rules.md)** - Design principles and guidelines
- **[Theme Rules](./_docs/theme-rules.md)** - Design system and theming
- **[Project Rules](./_docs/project-rules.md)** - Development conventions
- **[Development Plan](./_docs/phases/development-plan.md)** - 3-4 day development phases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/) for the excellent development foundation
- [Vercel](https://vercel.com/) for hosting and deployment
- [Clerk](https://clerk.com/) for authentication
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [V0](https://v0.dev/) for AI-powered UI scaffolding

---

Built with ❤️ using modern web technologies

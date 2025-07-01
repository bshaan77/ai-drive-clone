# Project Overview: Google Drive Clone

This project is a speed build challenge to build a fully functional Google Drive clone, then enhance it with AI features that surpass the functionality of Google Docs or Grammarly  Throughout the process I will be using AI first development principles to minimize the amount of manually written lines of code and complete the project as quick as possible.

## Purpose and Vision

The purpose of this project is to serve as a learning project for modern AI tools that software engineers are using for development. I choose to clone google drive because it is a large and complex enterprise app that will teach me how different technologies intereact with one another: such as uploading, downloading, sharing, and managing of files and folders. Once the google drive clone is complete is will also serve as a foundation for experimenting with AI tools and features that can be added onto the clone to make it better than google drive. Personally I can also see the possibility of forking this project and adapting it to a Learning Managment System I developed for students preparing college applications. The file storage and collaboration could be customized for the college application writing process, serving as the best place to manage applications. 

## Core functionalities

- **File & Folder Management:**
  - Upload and download of files and entire folders.
  - Creation, deletion, renaming, and moving of files and folders.
  - Hierarchical folder structure and intuitive navigation.

- **User Authentication & Authorization:**
  - Secure user registration and login.

- **File Sharing & Collaboration:**
  - Sharing files and folders with specific authenticated users.
  - Generating public shareable links with customizable access permissions (view-only, edit, expiry).

- **Search & Filtering:**
  - Efficient search capabilities based on file names, types, and tags
  - Filtering options for various file attributes.

- **Dashboard & Notifications:**
  - User-friendly dashboard displaying recent activity and file statistics.
  - Basic notification system for sharing events or important updates.

## Tech Stack

- **Framework:** Next.js (with React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Drizzle
- **Authentication:** Clerk
- **Deployment:** Vercel
- **Package Manager:** pnpm
- The project has been initialized using: pnpm create t3-app@latest
  │
  ◇ What will your project be called?
  │ drive-tutorial-ishaan
  │
  ◇ Will you be using TypeScript or JavaScript?
  │ TypeScript
  │
  ◇ Will you be using Tailwind CSS for styling?
  │ Yes
  │
  ◇ Would you like to use tRPC?
  │ No
  │
  ◇ What authentication provider would you like to use?
  │ None
  │
  ◇ What database ORM would you like to use?
  │ Drizzle
  │
  ◇ Would you like to use Next.js App Router?
  │ Yes
  │
  ◇ What database provider would you like to use?
  │ PostgreSQL
  │
  ◇ Would you like to use ESLint and Prettier or Biome for linting and formatting?
  │ ESLint/Prettier
  │
  ◇ Should we initialize a Git repository and stage the changes?
  │ Yes
  │
  ◇ Should we run 'pnpm install' for you?
  │ Yes
  │
  ◇ What import alias would you like to use?
  │ ~/
  Using: pnpm

  ✔ drive-tutorial-ishaan scaffolded successfully!

  Adding boilerplate...
  ✔ Successfully setup boilerplate for drizzle
  ✔ Successfully setup boilerplate for tailwind
  ✔ Successfully setup boilerplate for dbContainer
  ✔ Successfully setup boilerplate for envVariables
  ✔ Successfully setup boilerplate for eslint

  Installing dependencies...
  ✔ Successfully installed dependencies!

  Formatting project with eslint...
  ✔ Successfully formatted project
  Initializing Git...
  ✔ Successfully initialized and staged git

## Target Audience

- **Developers:** The goal of this project is not to replace google drive but instead showcase the development needed to build google drive. It does not need to be production scale, but instead be able to manage 5-10 users who want to manage their files with this google drive clone and take advantage of the AI features we will add.

## Scope

### Part 1: Core Clone:

- User authentication (registration, login, logout).
- File upload, download, delete, rename, move.
- Folder creation, deletion, rename, move.
- Private sharing with authenticated users.
- Public shareable links with basic permission control.
- Basic file versioning.
- Search functionality for file and folder names.
- Web-based user interface.

### Part 2: AI Enhancement:

- Context-aware suggestions powered by large language models
- Personalized writing recommendations based on user goals
- Advanced style analysis beyond rule-based corrections
- Intelligent content generation and improvement suggestions

## Ultimate Goal

Deliver a next-generation writing assistant that demonstrates how AI-first principles and modern language models can revolutionize writing assistance—surpassing the capabilities of traditional tools like Google Drive.

# Portfolio Tree - Next.js Application

## Project Overview
A modern portfolio application built with Next.js featuring tree-structured content organization, user authentication, and dynamic portfolio management.

## Key Features
- 🌳 **Tree Structure**: Hierarchical portfolio organization
- 🔐 **Authentication**: NextAuth.js with multiple providers
- 📊 **Dashboard**: Private admin panel for content management
- 🌐 **Public Profiles**: Shareable portfolio URLs
- 🎨 **Modern UI**: TailwindCSS with responsive design
- 🗄️ **Database**: PostgreSQL with Prisma ORM

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, Headless UI, Heroicons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Development**: ESLint, TypeScript

## Project Structure
```
app/
├── api/                 # API endpoints
├── dashboard/           # Admin dashboard
├── user/[username]/     # Public profiles
├── layout.tsx          # Root layout
└── page.tsx            # Landing page

components/
├── dashboard/          # Dashboard components
├── portfolio/          # Portfolio display components
└── providers/          # Context providers

lib/
├── auth.ts            # NextAuth configuration
└── prisma.ts          # Prisma client

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations
```

## Development Workflow
1. Start development server: `npm run dev`
2. Access at: http://localhost:3000
3. Dashboard: `/dashboard` (requires auth)
4. Public profiles: `/user/[username]`

## Database Schema
- **Users**: Authentication and profile data
- **Portfolios**: User portfolio containers
- **Nodes**: Tree-structured content items
- **Node Types**: CATEGORY, LANGUAGE, PROJECT, SKILL, EXPERIENCE, EDUCATION, DOCUMENTATION

## Key Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npx prisma studio` - Database GUI
- `npx prisma migrate dev` - Create migrations

## Authentication
- Supports OAuth providers (Google, GitHub)
- Credential-based authentication
- Protected routes and API endpoints
- Session management with NextAuth.js

## Current Status
✅ Project fully implemented and functional
✅ Database configured and migrated
✅ Authentication system complete
✅ CRUD operations for portfolio nodes
✅ Responsive UI with tree visualization
✅ Development server running

## Next Steps
- Implement drag & drop reordering
- Add image upload functionality
- Create portfolio templates
- Add export features
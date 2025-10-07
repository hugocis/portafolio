# Portfolio Tree - Next.js Application

## Project Overview
A modern portfolio application built with Next.js featuring tree-structured content organization, user authentication, and dynamic portfolio management.

## Key Features
- Tree Structure: Hierarchical portfolio organization
- Authentication: NextAuth.js with multiple providers
- Dashboard: Private admin panel for content management
- Public Profiles: Shareable portfolio URLs
- Modern UI: TailwindCSS with responsive design
- File Management: Image gallery and blob storage
- Database: PostgreSQL with Prisma ORM

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS, Headless UI, Heroicons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Storage**: Vercel Blob / Local storage
- **Authentication**: NextAuth.js
- **Development**: ESLint, TypeScript, Docker

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
1. Start development server: `npm run dev` or `.\deploy.ps1 -Dev`
2. Access at: http://localhost:3000
3. Dashboard: `/dashboard` (requires auth)
4. Public profiles: `/user/[username]`

## Documentation Structure
- **README.md** - Main documentation and quick start
- **docs/DOCKER.md** - Docker setup and commands
- **docs/DEPLOYMENT.md** - Deployment guides
- **docs/BLOBS.md** - File management system
- **docs/GITHUB_SETUP.md** - OAuth configuration
- **docs/TROUBLESHOOTING.md** - Common problems and solutions

## Database Schema
- **Users**: Authentication and profile data
- **Portfolios**: User portfolio containers
- **Nodes**: Tree-structured content items (CATEGORY, PROJECT, LANGUAGE, SKILL, EXPERIENCE, EDUCATION, DOCUMENTATION)
- **Blobs**: File storage metadata

## Key Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `.\deploy.ps1 -Dev` - Docker development mode
- `.\deploy.ps1 -Prod` - Docker production mode
- `npx prisma studio` - Database GUI
- `npx prisma migrate dev` - Create migrations

## Current Status
✅ Project fully implemented and functional
✅ Database configured with Blobs support
✅ Authentication system complete
✅ CRUD operations for portfolio nodes
✅ File upload and management system
✅ Image gallery in projects
✅ Responsive UI with tree visualization
✅ Multiple layout views (tree, grid, kanban, timeline)

## Documentation Guidelines
- Use clear, concise language without excessive emojis
- Use badges for technology stack
- Organize content with proper headings
- Include code examples with syntax highlighting
- Separate concerns into different documentation files
- Keep README.md as main entry point with links to detailed docs
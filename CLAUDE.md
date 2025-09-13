# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MOA is a financial management application built with React Router v7, TypeScript, and Supabase. It's designed for household budget management, expense tracking, and financial goal setting with multi-user support.

## Tech Stack & Key Libraries

- **Framework**: React Router v7 (using React 19)
- **Database**: PostgreSQL with Drizzle ORM, Supabase for auth/realtime
- **Styling**: Tailwind CSS v4, Shadcn UI components
- **UI Components**: Radix UI (via Shadcn), Lucide React icons, Tabler icons
- **Forms/Tables**: React Table, React Day Picker
- **Email**: Resend with React Email

## Development Commands

```bash
# Development
npm run dev                    # Start development server

# Build & Production
npm run build                  # Build for production
npm run start                  # Start production server

# Type Checking
npm run typecheck             # Generate route types and run TypeScript checks

# Database Management
npm run db:generate           # Generate Drizzle migrations
npm run db:migrate            # Run database migrations
npm run db:studio             # Open Drizzle Studio for database inspection
npm run db:drop               # Drop database (careful!)
npm run db:typegen            # Generate TypeScript types from Supabase schema
```

## Architecture & Code Organization

### Directory Structure
```
app/
├── features/           # Feature modules (auth, account, manage, goal, etc.)
│   ├── */schema.ts    # Drizzle schema definitions per feature
│   └── */*-page.tsx   # Route page components
├── common/
│   └── components/    # Shared UI components
│       ├── ui/        # Shadcn UI primitives
│       └── aceternity/# Additional UI components
├── lib/               # Utilities and helpers
├── api/               # API route handlers
├── sql/migrations/    # Database migrations
├── db.ts             # Database client instance
├── supa-client.ts    # Supabase client configuration
├── routes.ts         # Route configuration
└── root.tsx          # Root layout component
```

### Key Patterns & Conventions

#### React Router v7 Specifics
- Routes are defined in `app/routes.ts` using the new routing system
- Page components must export `loader`, `action`, and `meta` functions
- Route types imported as: `import type { Route } from "./+types/..."`
- Components receive `Router.ComponentProps` with `loaderData` and `actionData`
- No more `useLoaderData`/`useActionData` hooks - data comes via props
- Return plain objects from loaders/actions (no `json()` wrapper needed)

#### Database Architecture
- Uses Drizzle ORM with PostgreSQL
- Schema files distributed across features (`app/features/*/schema.ts`)
- Row-Level Security (RLS) implemented for multi-tenant data isolation
- Supabase handles authentication and real-time features

#### Component Guidelines
- Functional components only, no classes
- TypeScript interfaces over types
- Use Shadcn UI components from `app/common/components/ui/*`
- Never import directly from Radix UI
- Follow existing naming patterns (kebab-case for files, PascalCase for components)

#### Authentication & Session
- Supabase Auth for user management
- Server-side session handling in `app/session.server.tsx`
- Protected routes check authentication in loaders

## Feature Areas

### Core Features
- **Account Management**: Multi-household support with member invitations
- **Income/Expense Tracking**: Transaction management with categories
- **Budget Planning**: Monthly budgets with tracking
- **Financial Goals**: Savings goals with progress tracking
- **Member Management**: Roles (owner/member) and permissions

### Korean Context
The app is designed for Korean users with features and terminology reflecting local financial practices. UI text includes Korean language elements.

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `RESEND_API_KEY`: Resend API key for email notifications

## Important Notes

- Always use `Router.ComponentProps` type for page components
- Follow the existing pattern of exporting `loader`, `action`, and `meta` from route files
- Use Drizzle schema definitions for database operations
- Maintain RLS policies when modifying database queries
- Test multi-tenant isolation when working with data operations
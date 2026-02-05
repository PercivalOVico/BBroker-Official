# Replit.md

## Overview

This is a full-stack local business discovery and marketplace application with a Pinterest-inspired UI. The platform allows users to discover local businesses, browse products/services, and view marketing posts in a masonry-style feed. It supports multiple user roles (regular users, business owners, administrators, and shadow/moderation profiles) with role-specific dashboards and functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and interactions
- **Layout**: React Masonry CSS for Pinterest-style feed layout
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development Server**: Vite middleware for HMR during development
- **Production**: Static file serving from built assets

### Data Layer
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle's pgTable definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization
- **Storage Abstraction**: `server/storage.ts` provides an IStorage interface with in-memory implementation for development (MemStorage class) that can be swapped for database storage

### Key Data Models
- **Users**: Support for regular users and business profile types, with roles (user, administrator, shadow)
- **Businesses**: Local business listings with geolocation, ratings, and ownership
- **Products**: Marketplace items linked to businesses
- **Posts**: Marketing/promotional content from businesses
- **Comments**: Nested comment system with likes and save functionality

### Shared Code
- `shared/schema.ts`: Database schema definitions and Zod insert schemas
- `shared/routes.ts`: API route definitions with request/response schemas for type-safe client-server communication

### Build System
- Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client
- Dependency bundling allowlist to optimize cold start times
- Output to `dist/` directory with `dist/public` for static assets

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### UI Components
- **Radix UI**: Headless component primitives (accordion, dialog, dropdown, toast, etc.)
- **shadcn/ui**: Pre-styled components built on Radix
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider component
- **react-masonry-css**: Masonry grid layout

### Form & Validation
- **Zod**: Schema validation for API contracts and forms
- **React Hook Form**: Form state management
- **drizzle-zod**: Generate Zod schemas from Drizzle tables

### Data Fetching
- **TanStack React Query**: Server state management and caching

### Animation
- **Framer Motion**: Animation library for React

### Utilities
- **date-fns**: Date manipulation
- **clsx/tailwind-merge**: CSS class utilities
- **nanoid**: Unique ID generation
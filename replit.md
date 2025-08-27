# Portfolio Website - Replit.md

## Overview

This is a personal portfolio website for a Product Manager showcasing their experience, projects, and impact stories. The application is built as a full-stack web application with a React frontend and Express backend, designed to present professional achievements in AI, fintech, education, and healthcare sectors with a focus on emerging markets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/UI components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark modes

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server and API routes
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot reloading with Vite integration in development mode
- **Build System**: ESBuild for backend bundling, Vite for frontend

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle migrations with schema definitions in TypeScript
- **Connection**: Neon Database serverless PostgreSQL adapter
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **User Schema**: Basic user model with username/password fields
- **Storage Pattern**: Repository pattern with interface abstraction for different storage implementations

### Project Structure
- **Monorepo Layout**: Shared schema and types between client and server
- **Client**: React SPA with component-based architecture
- **Server**: Express API with modular route structure
- **Shared**: Common TypeScript definitions and database schema
- **Asset Management**: Dedicated folder for attached assets and media

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessible UI
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Shadcn/UI**: Pre-built component system with consistent design patterns
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment support
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code formatting and linting (configured via package.json)

### Frontend Libraries
- **React Hook Form**: Form handling with validation
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **Date-fns**: Date manipulation and formatting

### Backend Libraries
- **Express**: Web framework for API routes
- **Drizzle-Zod**: Runtime validation using Zod schemas
- **Session Management**: PostgreSQL session store integration

### Build and Development
- **Vite**: Frontend build tool with HMR and development server
- **ESBuild**: Fast backend bundling for production builds
- **TSX**: TypeScript execution for development server
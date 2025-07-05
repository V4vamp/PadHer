# replit.md

## Overview

This is a full-stack web application for "PadHer with Love," a non-profit organization focused on combating period poverty through education, empowerment, and accessible menstrual hygiene solutions. The application is built with a modern TypeScript stack featuring React on the frontend and Express.js on the backend, with PostgreSQL as the database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database serverless PostgreSQL
- **Authentication**: JWT-based authentication (simplified for development)
- **API Design**: RESTful API with JSON responses

### Project Structure
- `/client` - Frontend React application
- `/server` - Backend Express.js API
- `/shared` - Shared TypeScript schemas and types
- `/migrations` - Database migration files

## Key Components

### Database Schema
The application uses Drizzle ORM with PostgreSQL and includes the following main entities:
- **Users**: Authentication and user management with role-based access
- **Donations**: Tracking monetary contributions with Paystack integration
- **Volunteers**: Managing volunteer applications and opportunities
- **Blog Posts**: Content management for educational articles
- **Events**: Event management and registration system
- **Impact Stats**: Tracking organizational impact metrics

### Frontend Features
- **Public Pages**: Home, About, Blog, Events, Volunteer, Donate
- **Authentication**: Login/Register system
- **Admin Dashboard**: Content and data management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Reusable UI components with shadcn/ui

### Backend API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/donations` - Donation management
- `/api/volunteers` - Volunteer applications
- `/api/blog-posts` - Blog content management
- `/api/events` - Event management
- `/api/impact-stats` - Impact metrics

## Data Flow

1. **User Interaction**: Users interact with React components
2. **API Calls**: TanStack Query handles API requests to Express backend
3. **Database Operations**: Express routes use Drizzle ORM to interact with PostgreSQL
4. **Response Handling**: Data flows back through the same chain with proper error handling
5. **State Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Production Dependencies
- **UI Framework**: React, Radix UI, shadcn/ui components
- **Database**: Neon Database, Drizzle ORM, connect-pg-simple
- **Validation**: Zod for schema validation
- **Forms**: React Hook Form with resolvers
- **Styling**: Tailwind CSS, class-variance-authority
- **Icons**: Lucide React icons
- **Date Handling**: date-fns library

### Development Dependencies
- **Build Tools**: Vite, ESBuild for production builds
- **TypeScript**: Full TypeScript support across the stack
- **Development**: tsx for TypeScript execution, Replit-specific plugins

### Third-Party Integrations
- **Payment Processing**: Paystack for donation handling
- **Database Hosting**: Neon Database serverless PostgreSQL
- **Image Hosting**: Unsplash/external image services

## Deployment Strategy

### Development
- **Frontend**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution in development
- **Database**: Neon Database with connection pooling

### Production Build Process
1. Frontend builds to `/dist/public` using Vite
2. Backend bundles to `/dist` using ESBuild
3. Serves static files from Express in production
4. Database migrations run via Drizzle Kit

### Environment Configuration
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection
- Replit-specific configuration for development features

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
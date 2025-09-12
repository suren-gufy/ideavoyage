# Reddit Idea Validator Tool

## Overview

This is a Reddit Idea Validator Tool that uses AI to analyze startup ideas by examining Reddit discussions. The application helps entrepreneurs validate their ideas by analyzing sentiment, identifying pain points, and generating app suggestions based on real user conversations across relevant subreddits. It provides comprehensive analytics including sentiment analysis, pain point extraction, and AI-powered app idea generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system supporting dark/light themes
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Charts**: Recharts for data visualization (sentiment analysis, trends)

### Design System
- **Color Palette**: Dark mode primary with Reddit-inspired blue accent colors
- **Typography**: Inter font family with JetBrains Mono for code/metrics
- **Layout**: Sidebar navigation with responsive design
- **Components**: Comprehensive UI component library with consistent styling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the application
- **API Structure**: RESTful endpoints with `/api/analyze` for startup idea analysis
- **Middleware**: Request logging, JSON parsing, error handling
- **Development**: Hot module replacement with Vite integration

### Data Processing
- **AI Integration**: OpenAI API for analyzing startup ideas and generating insights
- **Analysis Features**: 
  - Keyword extraction for Reddit searches
  - Subreddit recommendations
  - Sentiment analysis with percentage breakdowns
  - Pain point identification with frequency scoring
  - App idea generation with difficulty assessment

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User management with basic authentication structure
- **Storage**: Memory storage implementation for development, ready for PostgreSQL production
- **Migrations**: Drizzle Kit for database schema management

### Application Features
- **Dashboard**: Main interface for idea validation with real-time analysis
- **Analytics**: Detailed sentiment analysis with interactive charts
- **Pain Points**: Categorized user problem identification
- **App Ideas**: AI-generated solution suggestions with validation metrics
- **Search Interface**: Form-based startup idea input with industry/market targeting

### Authentication & Security
- **User System**: Basic user registration and authentication setup
- **Session Management**: Express session handling
- **Input Validation**: Zod schemas for request validation

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: ESLint configuration with TypeScript rules
- **Path Aliases**: Configured for clean imports (@/ for client, @shared for shared)
- **Hot Reloading**: Development server with real-time updates

## External Dependencies

### AI & Analytics
- **OpenAI API**: GPT-based analysis for startup idea validation, sentiment analysis, and app idea generation
- **Recharts**: Data visualization library for sentiment charts and analytics displays

### Database & ORM
- **PostgreSQL**: Primary database (via Neon serverless)
- **Drizzle ORM**: Type-safe database operations with PostgreSQL adapter
- **Drizzle Kit**: Database migration and schema management

### UI & Design
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent UI elements
- **shadcn/ui**: Pre-built component library built on Radix primitives

### Development & Build
- **Vite**: Fast build tool with React plugin and TypeScript support
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form handling with Zod validation

### Hosting & Infrastructure
- **Replit**: Development and deployment platform
- **Neon Database**: Serverless PostgreSQL hosting
- **Express.js**: Web server framework with middleware support
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a construction daily report web application (工事日報報告システム) for HVAC companies. It enables construction workers to record daily reports, track site changes, client requests, worker feedback, and concerns to improve communication between field and office.

Key focus: The application emphasizes recording **subtle changes** in construction sites - environmental changes, minor equipment issues, neighbor reactions, client feedback, and worker insights that might otherwise be overlooked.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### TypeScript Compilation
The build process runs TypeScript compilation followed by Vite build: `tsc && vite build`

## Architecture Overview

### State Management (Zustand)
The application uses a single Zustand store (`src/stores/reportStore.ts`) with persistence middleware that saves all data to LocalStorage. The store manages:

- **Reports**: Daily construction reports with comprehensive tracking
- **Projects**: Construction project information 
- **Settings**: User preferences and defaults
- **Current Report**: Active editing state

Key pattern: All state mutations go through the store actions, ensuring data consistency and automatic persistence.

### Data Model Structure
The core data model revolves around the `DailyReport` interface which aggregates:

- Basic info (project, location, weather, workers)
- Work items and progress tracking
- **Critical tracking categories**:
  - `ChangeRecord[]` - Site changes (environment, equipment, neighbors)
  - `ClientRequest[]` - Client feedback and requests
  - `WorkerFeedback[]` - Worker insights and concerns
  - `Concern[]` - Safety, quality, and schedule risks
  - `Photo[]` - Visual documentation
  - `Communication[]` - Stakeholder interactions

### Form Architecture
Forms use React Hook Form + Zod validation with schemas in `src/utils/validationSchemas.ts`. Pattern:
1. Define Zod schema for validation
2. Export TypeScript type using `z.infer<>`
3. Use `useForm` with `zodResolver` in components
4. Handle form submission through store actions

### UI Component System
Built on Tailwind CSS + Shadcn/ui components in `src/components/ui/`. Key styling pattern:
- Blue backgrounds (`bg-blue-600`) always use white text (`text-white`)
- Status badges use semantic colors with appropriate contrast
- Mobile-first responsive design with lg: breakpoints

### Routing Structure
Single-page application with React Router:
- `/` - Dashboard (reports overview, statistics)
- `/create` - Daily report creation/editing
- `/changes` - Dedicated tracking for changes/requests/feedback/concerns
- `/photos` - Photo management and categorization
- `/projects` - Project CRUD operations
- `/export` - Report export functionality

Each route wraps content in the shared `Layout` component which handles navigation and mobile responsiveness.

### Layout System
- **Desktop**: Fixed sidebar navigation (`src/components/layout/Navigation.tsx`)
- **Mobile**: Hamburger menu with overlay (`src/components/layout/MobileNavigation.tsx`)
- **Header**: Shows current page title, mobile menu toggle, and quick actions
- **Responsive breakpoint**: `lg:` (1024px) switches between mobile and desktop layouts

## Key Development Patterns

### Form State Management
For complex forms (like CreateReport), separate local state is used for dynamic arrays (work items, materials, workers) and then merged into the main form data on submission.

### Data Persistence
All application data persists automatically via Zustand's persist middleware. No manual save operations required - data survives browser refresh and works offline.

### Type Safety
Comprehensive TypeScript throughout with strict type checking. All form data, store actions, and component props are fully typed.

### Mobile-First Design
All components designed for mobile first, then enhanced for desktop. Navigation automatically switches between sidebar and overlay patterns.

## Deployment Configuration

Configured for Netlify with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing handled via `netlify.toml` redirects

The application is a pure client-side app with no backend dependencies - ready for any static hosting service.

## Critical Business Logic

### Today's Report Logic
The application has special handling for "today's report" - automatically detects if a report exists for the current date and switches between create/edit modes accordingly.

### Progress Tracking
Reports track both planned vs actual progress percentages, enabling variance analysis across projects.

### Status Classification
Various entities use standardized status enums:
- Client requests: 対応済み | 検討中 | 未対応
- Concerns: 新規 | 対応中 | 解決済み | 監視中  
- Priority levels: 低 | 中 | 高 (with 緊急 for concerns)

### Photo Categorization
Photos are categorized by construction phase: 作業前 | 作業中 | 作業後 | 問題箇所 | 完成 | その他
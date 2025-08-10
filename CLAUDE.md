# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
MTK Care Help - A medical care assistance and support platform built with Next.js and shadcn/ui.

## Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **React**: v18 (important: not v19)

## Key Commands

### Development
```bash
npm run dev          # Start development server with Turbopack on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

## Project Structure
```
/app                 # Next.js App Router pages and layouts
  layout.tsx        # Root layout with sidebar integration
  page.tsx          # Home/Dashboard page
  globals.css       # Global styles with Tailwind directives

/components         
  /ui               # shadcn/ui components (auto-generated)
  app-sidebar.tsx   # Main navigation sidebar
  
/lib
  utils.ts          # Utility functions (cn for className merging)

components.json     # shadcn/ui configuration
tailwind.config.ts  # Tailwind CSS configuration
```

## Architecture Notes

### Sidebar Navigation
- The app uses shadcn/ui's sidebar component system
- Main layout wraps the app in `SidebarProvider` with `AppSidebar`
- Each page includes a header with `SidebarTrigger` and breadcrumbs
- Sidebar state is managed by the shadcn/ui sidebar context

### Component Philosophy
- shadcn/ui components are copied into the project (not npm packages)
- Components live in `/components/ui` and can be customized
- Use the `cn()` utility from `/lib/utils` for conditional styling
- Components use Radix UI for behavior and Tailwind for styling

### Dependency Management
- Keep React at v18 to match the main application
- Only install dependencies that are actually needed
- Tailwind CSS should stay at v3 (not v4) for compatibility
- Core dependencies are minimal: Next.js, React, Tailwind, Radix UI, and utility libraries

## Important Conventions
1. Use the existing shadcn/ui components when possible
2. Follow the header pattern with SidebarTrigger and Breadcrumbs on each page
3. Maintain consistent spacing using Tailwind classes
4. Use CSS variables for theming (already configured in globals.css)
5. Keep components server-side by default unless client interactivity is needed
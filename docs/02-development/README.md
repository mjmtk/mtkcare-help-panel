# Development

Development workflows, coding standards, and best practices for MTK Care Help.

## Contents

- [Setup](./setup.md) - Development environment setup
- [Coding Standards](./coding-standards.md) - Code style and conventions
- [Component Development](./components.md) - Creating and maintaining components
- [Help System](./help-system.md) - Working with the integrated help panel

## Development Workflow

1. **Branch naming**: `feature/description`, `fix/description`, `docs/description`
2. **Commit messages**: Follow conventional commits format
3. **Code review**: All changes require review before merge
4. **Testing**: Ensure all functionality works before committing

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **React 18** - UI library (maintained at v18 for compatibility)
# MTK Care Help Panel

A modern, accessible help panel system for healthcare applications, built with Next.js, shadcn/ui, and Supabase. Optimized for New Zealand users with Sydney-region hosting.

## Features

- 🏥 **Healthcare-Focused**: Designed for NZ community service organizations
- 🔒 **Privacy-First**: No PII/PHI stored, only help content
- ⚡ **Fast Performance**: Sydney-region hosting for optimal NZ latency
- 🎨 **Modern UI**: Built with shadcn/ui and Radix primitives
- 🔍 **Full-Text Search**: Powered by PostgreSQL with tsvector
- 📱 **Responsive**: Works seamlessly on desktop and mobile
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 📊 **Analytics**: Anonymous usage tracking for content improvement

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account (free tier works)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/mjmtk/mtkcare-help-panel.git
cd mtkcare-help-panel
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Supabase:**
   - Create a new Supabase project in **ap-southeast-2 (Sydney)**
   - Run the SQL scripts in order:
     - `docs/05-deployment/supabase-schema.sql`
     - `docs/05-deployment/initial-help-content.sql`

4. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

5. **Run development server:**
```bash
npm run dev
# Opens on http://localhost:3001
```

## Integration Options

### Option 1: Direct Django Integration (Recommended)

Copy the help panel components directly into your Django app's React frontend:

```bash
# Copy these folders to your Django app
help-panel/components/ → your-app/frontend/src/components/help/
help-panel/hooks/      → your-app/frontend/src/hooks/help/
help-panel/lib/        → your-app/frontend/src/lib/help/
help-panel/types/      → your-app/frontend/src/types/help/
```

See [Django Integration Guide](docs/03-architecture/django-integration-guide.md) for detailed instructions.

### Option 2: Standalone Deployment

Deploy as a separate service using Vercel:

```bash
npm i -g vercel
vercel
```

See [Deployment Checklist](docs/05-deployment/deployment-checklist.md) for production setup.

## Project Structure

```
mtkcare-help-panel/
├── app/                 # Next.js app directory
│   ├── api/            # API routes for help content
│   └── layout.tsx      # Main layout with sidebar
├── components/         # UI components
│   ├── help/          # Help panel components
│   └── ui/            # shadcn/ui components
├── help-panel/        # Modular help panel package
│   ├── components/    # Standalone help components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # API and utilities
│   └── types/         # TypeScript definitions
├── docs/              # Documentation
│   ├── 03-architecture/  # Architecture decisions
│   └── 05-deployment/    # Deployment guides
└── lib/               # Shared utilities
    └── supabase.ts    # Supabase client
```

## Content Management

### Update Help Articles

Help content is stored in Supabase and can be updated in several ways:

1. **Supabase Dashboard**: Direct table editing
2. **SQL Queries**: Bulk updates via SQL editor
3. **Future: Notion Integration**: Non-coder friendly updates

### Database Schema

- `categories`: Help content categories
- `help_articles`: Main content with full-text search
- `help_analytics`: Anonymous usage tracking

## Development

### Available Scripts

```bash
npm run dev      # Start development server on port 3001
npm run build    # Build for production
npm run lint     # Run ESLint
npm run type-check # Run TypeScript check
```

### Key Technologies

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel (optional)

## Documentation

- [Getting Started](docs/01-getting-started/README.md)
- [Architecture Overview](docs/03-architecture/README.md)
- [Django Integration](docs/03-architecture/django-integration-guide.md)
- [Deployment Guide](docs/05-deployment/README.md)
- [API Reference](docs/04-api/README.md)

## Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/mjmtk/mtkcare-help-panel/issues)
- Check the [Troubleshooting Guide](docs/07-troubleshooting/README.md)

## License

MIT - See [LICENSE](LICENSE) file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org) and [shadcn/ui](https://ui.shadcn.com)
- Powered by [Supabase](https://supabase.com)
- Optimized for New Zealand healthcare organizations
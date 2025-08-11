# Django Integration Guide

## Direct Integration Approach

This guide explains how to integrate the help panel directly into your existing Django healthcare application.

## Architecture Overview

```
Django App (Azure)
├── Backend (Django) - Handles healthcare data
└── Frontend (React)
    ├── Main App Components
    └── Help Panel (from this repo)
        └── Fetches from → Supabase (Sydney)
```

## Integration Steps

### 1. Copy Help Panel Components

Copy these folders from this repository to your Django app's React frontend:

```bash
# From this repo
help-panel/
├── components/     → your-django-app/frontend/src/components/help/
├── hooks/         → your-django-app/frontend/src/hooks/help/
├── lib/           → your-django-app/frontend/src/lib/help/
├── types/         → your-django-app/frontend/src/types/help/
└── styles/        → your-django-app/frontend/src/styles/help/
```

### 2. Install Required Dependencies

Add these to your Django app's frontend package.json:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.54.0",
    "lucide-react": "^0.344.0"
  }
}
```

### 3. Configure Environment Variables

Add to your Django app's frontend .env:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://duabfbgristkzwfunyfh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Note: Service role key not needed for read-only access
```

### 4. Integrate Help Panel in Your Layout

In your main Django app's React layout:

```tsx
import { HelpProvider } from '@/components/help/help-provider'
import { HelpTrigger } from '@/components/help/help-trigger'
import { IntegratedHelpPanel } from '@/components/help/integrated-help-panel'

export function MainLayout({ children }) {
  return (
    <HelpProvider>
      <div className="app-layout">
        <Header>
          {/* Your existing header content */}
          <HelpTrigger /> {/* Adds the ? button */}
        </Header>
        
        <MainContent>
          {children}
        </MainContent>
        
        <IntegratedHelpPanel /> {/* The sliding panel */}
      </div>
    </HelpProvider>
  )
}
```

### 5. Update Supabase Configuration

Ensure your Supabase client is initialized properly:

```typescript
// lib/help/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Help panel: Supabase credentials not configured')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
```

## Benefits of This Approach

### ✅ Security & Compliance
- Help content is completely separate from healthcare data
- No PII/PHI in help system
- Supabase handles only public help content
- Main app remains in Azure for compliance

### ✅ Independent Content Management
- Update help content via Supabase without deploying Django app
- Non-technical users can manage content
- Content changes are instant

### ✅ Performance
- Help content served from Sydney (optimal for NZ)
- No load on Django backend
- Client-side caching of help content

### ✅ Simplicity
- No CORS configuration needed
- Single domain for users
- No separate hosting costs
- Unified authentication (if needed)

## Content Management Options

### Option A: Direct Supabase Updates
- Use Supabase dashboard for content updates
- SQL queries for bulk updates
- Good for technical users

### Option B: Notion Integration (Future)
- Set up Notion database
- Use automation to sync to Supabase
- Better for non-technical content creators

### Option C: Custom Admin Panel (Future)
- Build simple admin UI in Django
- Write to Supabase from Django backend
- Full control over content workflow

## Testing the Integration

1. **Verify Supabase Connection:**
   ```javascript
   // In browser console
   console.log(window.NEXT_PUBLIC_SUPABASE_URL)
   // Should show your Supabase URL
   ```

2. **Check Help Panel Loading:**
   - Click the help button (?)
   - Panel should slide in from right
   - Content should load from Supabase

3. **Test Search Functionality:**
   - Type in search bar
   - Results should filter in real-time

4. **Verify Analytics (Optional):**
   - Check Supabase dashboard for analytics events
   - View counts should increment

## Troubleshooting

### Help Panel Not Loading
- Check browser console for errors
- Verify environment variables are set
- Ensure Supabase project is active

### CORS Issues (Shouldn't Happen)
- Not expected with direct integration
- If occurs, check Supabase dashboard CORS settings

### Styling Conflicts
- Help panel uses Tailwind with prefixed classes
- Adjust CSS specificity if needed
- Use CSS modules for isolation

## Maintenance

### Updating Help Content
1. Log into Supabase dashboard
2. Navigate to Table Editor → help_articles
3. Edit content directly or via SQL

### Monitoring Usage
- Check help_analytics table for usage patterns
- Popular topics indicate documentation gaps
- Search queries show what users need

### Performance Optimization
- Help content is cached client-side
- Supabase handles CDN distribution
- Consider implementing service worker for offline access

## Next Steps

1. **Complete Integration:** Copy components to Django app
2. **Test Thoroughly:** Ensure help panel works in production environment
3. **Train Team:** Show content creators how to update help articles
4. **Monitor Usage:** Use analytics to improve help content
5. **Iterate:** Add more help content based on user needs
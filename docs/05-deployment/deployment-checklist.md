# Supabase + Vercel Deployment Checklist

## Phase 1: Supabase Setup ✅

### 1.1 Create Supabase Project
- [x] Visit [supabase.com](https://supabase.com)
- [x] Create new project: "mtkcare-help-content"
- [x] Choose region: **ap-southeast-2 (Sydney)** for NZ optimization
- [x] Security options: **Data API + Connection String** (public schema)

### 1.2 Run Database Setup
Copy and run these SQL scripts in your Supabase SQL editor:

1. **Run schema setup**: `docs/05-deployment/supabase-schema.sql`
2. **Run initial data**: `docs/05-deployment/initial-help-content.sql`

### 1.3 Get API Keys
From your Supabase dashboard > Settings > API:
- Copy **Project URL** 
- Copy **anon/public key**
- Copy **service_role key** (keep this secret!)

## Phase 2: Vercel Deployment

### 2.1 Environment Variables Setup
Create `.env.local` file with your Supabase credentials:

```bash
# Copy from .env.example and fill in your values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 2.2 Test Local Integration
```bash
# Test the connection locally first
npm run dev

# Visit http://localhost:3001
# Click the help button (?) to test the panel
# Search for content to verify database connection
```

### 2.3 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# https://vercel.com/your-username/mtkcare-help/settings/environment-variables

# Add these variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Phase 3: Content Management Setup (Optional)

### 3.1 Notion Integration
If you want non-coder content management:

1. **Create Notion database** using this template:
   - Title (Title field)
   - Description (Text)  
   - Content (Rich text)
   - Category (Select: Getting Started, Features, Troubleshooting, Reference, Tips)
   - Tags (Multi-select)
   - Status (Select: Draft, Review, Published)

2. **Get Notion API token**:
   - Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Create new integration
   - Copy the token

3. **Add to environment variables**:
   ```bash
   NOTION_TOKEN=your-notion-token
   NOTION_DATABASE_ID=your-database-id
   ```

## Phase 4: Testing & Verification

### 4.1 Verify Help Panel Works
- [ ] Help button appears in header
- [ ] Panel opens/closes correctly
- [ ] Content loads from Supabase
- [ ] Search functionality works
- [ ] Categories filter properly
- [ ] Mobile responsiveness works

### 4.2 Verify API Endpoints
Test these endpoints work:
```bash
# Get all help content
curl https://your-app.vercel.app/api/help/content

# Get specific article  
curl https://your-app.vercel.app/api/help/content/dashboard-overview

# Get popular topics
curl https://your-app.vercel.app/api/help/popular
```

### 4.3 Performance Check
- [ ] Page load times < 2 seconds from NZ
- [ ] Search results return quickly
- [ ] Images/content load fast
- [ ] Mobile performance acceptable

## Phase 5: Integration with Django App

### 5.1 Extract Help Panel Package
The help panel is ready to integrate into your Django app:

```typescript
// In your main Django app's React components:
import { 
  HelpProvider, 
  HelpTrigger, 
  IntegratedHelpPanel 
} from './help-panel'

function MainLayout({ children }) {
  return (
    <HelpProvider config={{
      apiBaseUrl: 'https://mtkcare-help.vercel.app/api',
      analytics: false,
      theme: 'auto'
    }}>
      <div className="app-layout">
        <Header>
          <HelpTrigger />  {/* ? button */}
        </Header>
        <MainContent>{children}</MainContent>
        <IntegratedHelpPanel />  {/* Help overlay */}
      </div>
    </HelpProvider>
  )
}
```

### 5.2 Copy Required Files
Copy these folders to your Django app:
- `help-panel/components/`
- `help-panel/hooks/`  
- `help-panel/lib/`
- `help-panel/types/`

## Troubleshooting

### Common Issues

**Help panel doesn't load:**
- Check browser console for errors
- Verify environment variables are set
- Test API endpoints directly

**Supabase connection fails:**
- Verify API keys are correct
- Check if RLS policies are properly set
- Ensure project URL is correct

**Slow performance from NZ:**
- Verify Sydney region was selected
- Check CDN cache headers are working
- Test from different NZ locations

### Getting Help

- **Documentation**: All guides in `/docs` folder
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)  
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

## Success Metrics

✅ **Deployment successful when:**
- Help panel loads in < 2 seconds from NZ
- Search returns results in < 1 second
- Content management workflow works smoothly
- No JavaScript errors in browser console
- Mobile experience is smooth and responsive

## Next Steps

After successful deployment:
1. **Train content creators** on Notion workflow
2. **Monitor performance** and usage analytics
3. **Gather user feedback** and iterate
4. **Plan additional help content** based on usage patterns

Your NZ-optimized help content service is now ready for production! 🚀
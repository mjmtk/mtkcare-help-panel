# NZ-Optimized Architecture for Help Content Service

## Updated Requirements
- **Location**: New Zealand (need fast content delivery)
- **Content Management**: Non-coders using Claude Desktop
- **Integration**: Extract help panel into main Django app

## 🌏 **NZ-Optimized Provider Choice**

### **Updated Recommendation: Vercel + Supabase (Sydney Region)**

#### **Why This Still Works for NZ:**
- **Vercel Edge Network**: Has Sydney edge nodes (20-30ms to NZ)
- **Supabase Asia-Pacific**: Sydney region available (low latency)
- **Content Delivery**: CDN ensures fast asset delivery
- **Database Performance**: Sub-50ms queries from NZ

#### **Performance Expectations:**
```
Auckland ↔ Sydney:
- Latency: 20-30ms
- Bandwidth: Excellent (submarine cables)
- CDN Coverage: Full coverage via Sydney edge
```

## 🎯 **Content Management for Non-Coders**

### **Solution: Notion + Supabase Integration**

#### **Content Creation Workflow:**
```
1. Non-coder writes content in Notion
2. Claude Desktop helps structure content
3. Automated sync to Supabase
4. Live updates in help panel
```

#### **Architecture:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Notion CMS    │────│  Sync Service   │────│   Supabase DB   │────│   Help Panel    │
│  (Non-coders)   │    │ (Vercel Cron)   │    │  (Content API)  │    │  (Django App)   │
│                 │    │                 │    │                 │    │                 │
│ • Write content │    │ • Notion API    │    │ • Help articles │    │ • Read-only UI  │
│ • Use templates │    │ • Auto-sync     │    │ • Search index  │    │ • Fast delivery │
│ • Claude assist │    │ • Data transform│    │ • Analytics     │    │ • NZ optimized  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Non-Coder Content Management Setup:**

#### **1. Notion Database Template:**
```
Help Articles Database:
├── Title (Title field)
├── Description (Text field) 
├── Content (Rich text field)
├── Category (Select: Getting Started, Features, Troubleshooting, Reference)
├── Tags (Multi-select field)
├── Status (Select: Draft, Review, Published)
├── Last Updated (Date field)
└── ID (Formula: slug from title)
```

#### **2. Claude Desktop Integration:**
```
Prompt Templates for Content Creators:

"Help me create a help article about [TOPIC] for healthcare workers. 
Structure it with:
- Clear title
- Brief description
- Step-by-step content
- Common issues section
- Related topics

Keep it simple and actionable for counsellors and case managers."
```

## 🔗 **Help Panel Extraction for Django Integration**

### **Standalone Help Panel Architecture:**

#### **Deployable Components:**
```
help-panel/
├── components/
│   ├── help-provider.tsx         # Context provider
│   ├── help-trigger.tsx          # Trigger button  
│   ├── integrated-help-panel.tsx # Main panel component
│   └── help/                     # All help UI components
├── hooks/
│   └── use-help-content.ts       # Data fetching hooks
├── lib/
│   └── help-api.ts               # API client
├── types/
│   └── help.ts                   # TypeScript definitions
└── styles/
    └── help-panel.css            # Scoped styles
```

#### **Integration Package Structure:**
```typescript
// help-panel/index.ts - Main export file
export { HelpProvider } from './components/help-provider'
export { HelpTrigger } from './components/help-trigger'  
export { IntegratedHelpPanel } from './components/integrated-help-panel'
export { useHelp } from './components/help-provider'
export type { HelpContent, HelpSearchParams } from './types/help'

// Simple integration for Django app:
import { HelpProvider, HelpTrigger, IntegratedHelpPanel } from '@/help-panel'
```

### **Django Integration Pattern:**

#### **1. React Component Integration:**
```typescript
// In your main Django app's React components:
function MainLayout({ children }) {
  return (
    <HelpProvider apiBaseUrl="https://mtkcare-help.vercel.app/api">
      <div className="app-layout">
        <Header>
          <HelpTrigger />  {/* Help button in header */}
        </Header>
        <Sidebar />
        <MainContent>
          {children}
        </MainContent>
        <IntegratedHelpPanel />  {/* Help panel overlay */}
      </div>
    </HelpProvider>
  )
}
```

#### **2. Configuration Options:**
```typescript
// help-panel/config.ts
export interface HelpPanelConfig {
  apiBaseUrl: string
  theme?: 'light' | 'dark' | 'auto'
  position?: 'right' | 'left'
  defaultMode?: 'sheet' | 'pinned'
  analytics?: boolean
  customStyles?: string
}

// Usage in Django app:
<HelpProvider config={{
  apiBaseUrl: process.env.NEXT_PUBLIC_HELP_API_URL,
  theme: 'auto',
  analytics: false,  // Disabled for compliance
  position: 'right'
}}>
```

## 📈 **Notion → Supabase Sync Service**

### **Automated Content Synchronization:**

#### **Vercel Cron Job Setup:**
```typescript
// app/api/sync/notion/route.ts
import { Client } from '@notion/client'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN
    })

    // Fetch published articles from Notion
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Status',
        select: { equals: 'Published' }
      }
    })

    // Transform and sync to Supabase
    for (const page of response.results) {
      await syncArticleToSupabase(page)
    }

    return Response.json({ success: true, synced: response.results.length })
  } catch (error) {
    console.error('Notion sync error:', error)
    return Response.json({ error: 'Sync failed' }, { status: 500 })
  }
}

async function syncArticleToSupabase(notionPage: any) {
  // Transform Notion page to help article format
  const article = {
    id: generateSlug(notionPage.properties.Title.title[0].plain_text),
    title: notionPage.properties.Title.title[0].plain_text,
    description: notionPage.properties.Description.rich_text[0]?.plain_text || '',
    content: await getNotionPageContent(notionPage.id),
    category: notionPage.properties.Category.select?.name || 'General',
    tags: notionPage.properties.Tags.multi_select.map(tag => tag.name),
    updated_at: new Date().toISOString()
  }

  // Upsert to Supabase
  const { error } = await supabaseAdmin
    .from('help_articles')
    .upsert(article)

  if (error) throw error
}
```

#### **Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/sync/notion",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

## 🚀 **Deployment Strategy for NZ**

### **1. Supabase Setup (Sydney Region):**
```sql
-- Create project in ap-southeast-2 (Sydney)
-- This ensures <50ms latency to NZ
```

### **2. Vercel Deployment:**
```bash
# Vercel automatically uses Sydney edge for NZ traffic
vercel --prod

# Environment variables for NZ optimization:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co  # Sydney region
NOTION_DATABASE_ID=your-notion-db-id
NOTION_TOKEN=your-notion-token
```

### **3. CDN Optimization:**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['supabase.co'],
  },
  headers: async () => [
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=3600'  // 5min browser, 1hr CDN
        }
      ]
    }
  ]
}
```

## 📋 **Content Creator Workflow**

### **For Non-Coders Using Claude Desktop:**

#### **1. Content Creation Process:**
```
Step 1: Open Notion Help Articles database
Step 2: Create new page using template
Step 3: Use Claude Desktop prompt:

"Help me write a help article for healthcare case managers about [TOPIC]. 
Include:
- Clear step-by-step instructions
- Common problems and solutions  
- Screenshots if needed
- Links to related help topics

Make it simple and practical for busy counsellors."

Step 4: Paste Claude's response into Notion
Step 5: Set Status to "Published" 
Step 6: Content auto-syncs within 6 hours (or trigger manual sync)
```

#### **2. Content Templates:**
```markdown
# Template: Feature Guide
**Title:** How to [Action] in [Feature]
**Description:** Quick guide for [specific user type]

## Overview
Brief explanation of what this feature does

## Step-by-Step Guide
1. First step with screenshot
2. Second step with details
3. etc.

## Common Issues
- Problem: Solution
- Problem: Solution

## Related Topics
- Link to related help article
- Link to related help article
```

### **3. Quality Assurance:**
- **Preview Mode**: Content creators can preview in Notion
- **Review Process**: Status field allows for review workflow
- **Version Control**: Notion maintains edit history
- **Fast Updates**: Changes sync automatically

## 🔧 **Performance Optimizations for NZ**

### **Content Delivery:**
- **Edge Caching**: 1-hour CDN cache for content
- **Compression**: Gzip/Brotli for all responses  
- **Lazy Loading**: Load help content on demand
- **Local Storage**: Cache frequently accessed content

### **Database Optimization:**
- **Connection Pooling**: Supabase handles automatically
- **Query Optimization**: Indexed searches for fast results
- **Batch Operations**: Efficient content synchronization

This architecture provides fast content delivery to NZ, easy content management for non-coders, and clean integration with your main Django app.
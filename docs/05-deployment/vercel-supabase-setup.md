# Vercel + Supabase Deployment Setup

## Architecture Overview

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Next.js Frontend  │    │   Vercel Functions  │    │   Supabase DB       │
│   (Help Panel UI)   │────│   (API Layer)       │────│   (Content Storage) │
│                     │    │   /api/help/*       │    │   - Help Articles   │
│   Deployed on:      │    │   - Rate limiting   │    │   - Categories      │
│   Vercel Pages      │    │   - Anonymous only  │    │   - Analytics       │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
```bash
# Visit https://supabase.com and create account
# Create new project: "mtkcare-help-content"
# Choose region closest to your users (US East or EU)
```

### 1.2 Database Schema
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Help articles table  
CREATE TABLE help_articles (
  id TEXT PRIMARY KEY,  -- Keep existing IDs like "dashboard-overview"
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Search index
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', description), 'B') ||
    setweight(to_tsvector('english', content), 'C')
  ) STORED
);

-- Analytics table (anonymous usage tracking)
CREATE TABLE help_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id TEXT,
  action TEXT NOT NULL,  -- 'view', 'search', 'feedback'
  context TEXT,  -- search query, etc.
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  -- No user identification fields for compliance
  session_hash TEXT  -- Optional: anonymized session for basic analytics
);

-- Indexes for performance
CREATE INDEX help_articles_search_idx ON help_articles USING gin(search_vector);
CREATE INDEX help_articles_category_idx ON help_articles(category_id);
CREATE INDEX help_articles_published_idx ON help_articles(is_published);
CREATE INDEX help_analytics_timestamp_idx ON help_analytics(timestamp);
CREATE INDEX help_analytics_article_idx ON help_analytics(article_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_articles_updated_at BEFORE UPDATE ON help_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.3 Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Published articles are publicly readable" ON help_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Categories are publicly readable" ON categories
  FOR SELECT USING (true);

-- Analytics write-only (no read access for privacy)
CREATE POLICY "Allow anonymous analytics writes" ON help_analytics
  FOR INSERT WITH CHECK (true);

-- Note: Admin access will be handled via service key in Vercel functions
```

### 1.4 Seed Data
```sql
-- Insert categories
INSERT INTO categories (name, description, icon, sort_order) VALUES
  ('Getting Started', 'Basic setup and navigation', 'play-circle', 1),
  ('Features', 'Application features and how to use them', 'star', 2),
  ('Troubleshooting', 'Common issues and solutions', 'alert-circle', 3),
  ('Reference', 'Technical reference and guides', 'book-open', 4);

-- Insert help articles (migrate from existing mock data)
INSERT INTO help_articles (id, title, description, content, category_id, tags) 
SELECT 
  'dashboard-overview',
  'Dashboard Overview',
  'Understanding your main dashboard',
  'The dashboard provides a comprehensive view of your account activity...',
  (SELECT id FROM categories WHERE name = 'Getting Started'),
  ARRAY['dashboard', 'overview', 'navigation'];

-- Continue with other articles...
```

## Step 2: Vercel Deployment Setup

### 2.1 Environment Variables
```bash
# In Vercel dashboard, add these environment variables:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key  # For admin operations
NEXT_PUBLIC_APP_ENV=production
```

### 2.2 Update API Layer for Supabase
Create new API implementation:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// For server-side admin operations
export const supabaseAdmin = createClient(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 2.3 Update Help API Client
```typescript
// lib/help/help-api.ts - Updated for Supabase
import { supabase } from '@/lib/supabase'
import type { HelpContent, HelpSearchParams, HelpAnalytics } from "@/types/help"

export class HelpAPI {
  static async getHelpContent(params?: HelpSearchParams): Promise<HelpContent[]> {
    let query = supabase
      .from('help_articles')
      .select(`
        *,
        categories (
          name,
          icon
        )
      `)
      .eq('is_published', true)

    // Apply filters
    if (params?.category) {
      query = query.eq('categories.name', params.category)
    }

    if (params?.tags && params.tags.length > 0) {
      query = query.contains('tags', params.tags)
    }

    if (params?.query) {
      // Full-text search
      query = query.textSearch('search_vector', params.query)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getHelpTopic(id: string): Promise<HelpContent | null> {
    const { data, error } = await supabase
      .from('help_articles')
      .select(`
        *,
        categories (
          name,
          icon
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) throw error
    return data
  }

  static async trackAnalytics(analytics: Omit<HelpAnalytics, 'id' | 'timestamp'>) {
    const { error } = await supabase
      .from('help_analytics')
      .insert({
        article_id: analytics.topicId,
        action: analytics.action,
        context: analytics.context,
        session_hash: analytics.sessionHash
      })

    if (error) console.error('Analytics tracking error:', error)
  }

  static async getPopularTopics(): Promise<HelpContent[]> {
    const { data, error } = await supabase
      .from('help_articles')
      .select(`
        *,
        categories (
          name,
          icon
        )
      `)
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  }
}
```

### 2.4 Update API Routes for Vercel Functions
```typescript
// app/api/help/content/route.ts - Updated for Vercel + Supabase
import { NextRequest, NextResponse } from "next/server"
import { HelpAPI } from "@/lib/help/help-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
    }

    const content = await HelpAPI.getHelpContent(params)
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Help content API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch help content' }, 
      { status: 500 }
    )
  }
}

// Enable CORS for cross-origin requests from your main app
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

## Step 3: Deployment Configuration

### 3.1 Install Supabase Dependencies
```bash
npm install @supabase/supabase-js
```

### 3.2 Update Package.json
```json
{
  "scripts": {
    "dev": "next dev --turbopack --port 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts"
  }
}
```

### 3.3 Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",  
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

## Step 4: Content Management

### 4.1 Supabase Dashboard Access
- Use Supabase dashboard for content editing
- Table editor for direct content management
- SQL editor for bulk operations
- Authentication for admin access

### 4.2 Content Workflow
1. **Create content** in Supabase dashboard
2. **Preview** using API endpoints  
3. **Publish** by setting `is_published = true`
4. **Analytics** tracked automatically

## Step 5: Integration with Main Django App

### 5.1 Update Help Panel API URLs
```typescript
// In main Django app's frontend, update API base URL
const HELP_API_BASE = process.env.NEXT_PUBLIC_HELP_API_URL || 
  'https://mtkcare-help.vercel.app/api'
```

### 5.2 Django Proxy (Optional)
```python
# Django view to proxy help requests (if needed for compliance)
import requests
from django.http import JsonResponse
from django.views import View

class HelpContentProxy(View):
    def get(self, request):
        # Strip any identifying information
        params = {
            'query': request.GET.get('query'),
            'category': request.GET.get('category'),
        }
        
        response = requests.get(
            'https://mtkcare-help.vercel.app/api/help/content',
            params=params
        )
        
        # Log usage locally if needed
        if request.user.is_authenticated:
            HelpUsageLog.objects.create(
                user=request.user,
                query=params.get('query'),
                category=params.get('category')
            )
        
        return JsonResponse(response.json(), safe=False)
```

## Deployment Commands

```bash
# 1. Deploy to Vercel
npx vercel

# 2. Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
vercel env add SUPABASE_SERVICE_ROLE_KEY

# 3. Deploy with environment variables
vercel --prod
```

This setup provides a fully external, compliant, and scalable help content service using the best free tier options available.
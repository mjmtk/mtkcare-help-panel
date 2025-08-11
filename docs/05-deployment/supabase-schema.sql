-- MTK Care Help Content Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- For UUID generation

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Lucide icon name
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Help articles table  
CREATE TABLE public.help_articles (
  id TEXT PRIMARY KEY,  -- Keep existing IDs like "dashboard-overview"
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Search index (computed column)
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED
);

-- Analytics table (anonymous usage tracking)
CREATE TABLE public.help_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id TEXT, -- Can be NULL for search queries
  action TEXT NOT NULL CHECK (action IN ('view', 'search', 'feedback')),
  context TEXT, -- Search query, feedback text, etc.
  session_hash TEXT, -- Optional: anonymized session for basic analytics
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX help_articles_search_idx ON help_articles USING gin(search_vector);
CREATE INDEX help_articles_category_idx ON help_articles(category_id);
CREATE INDEX help_articles_published_idx ON help_articles(is_published) WHERE is_published = true;
CREATE INDEX help_articles_view_count_idx ON help_articles(view_count DESC);
CREATE INDEX help_analytics_timestamp_idx ON help_analytics(timestamp);
CREATE INDEX help_analytics_article_idx ON help_analytics(article_id);
CREATE INDEX help_analytics_action_idx ON help_analytics(action);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_articles_updated_at 
  BEFORE UPDATE ON help_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(article_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE help_articles 
  SET view_count = view_count + 1 
  WHERE id = article_id AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular articles
CREATE OR REPLACE FUNCTION get_popular_articles(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  description TEXT,
  content TEXT,
  category_name TEXT,
  category_icon TEXT,
  tags TEXT[],
  view_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ha.id,
    ha.title,
    ha.description,
    ha.content,
    c.name as category_name,
    c.icon as category_icon,
    ha.tags,
    ha.view_count,
    ha.created_at,
    ha.updated_at
  FROM help_articles ha
  LEFT JOIN categories c ON ha.category_id = c.id
  WHERE ha.is_published = true
  ORDER BY ha.view_count DESC, ha.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories
CREATE POLICY "Categories are publicly readable" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Only service role can modify categories" 
  ON categories FOR ALL 
  USING (auth.role() = 'service_role');

-- RLS Policies for Help Articles
CREATE POLICY "Published articles are publicly readable" 
  ON help_articles FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Only service role can modify help articles" 
  ON help_articles FOR ALL 
  USING (auth.role() = 'service_role');

-- RLS Policies for Analytics (write-only for privacy)
CREATE POLICY "Allow anonymous analytics writes" 
  ON help_analytics FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only service role can read analytics" 
  ON help_analytics FOR SELECT 
  USING (auth.role() = 'service_role');

-- Insert default categories
INSERT INTO categories (name, description, icon, sort_order) VALUES
  ('Getting Started', 'Basic setup and navigation guides', 'play-circle', 1),
  ('Features', 'Application features and how to use them', 'star', 2),
  ('Troubleshooting', 'Common issues and solutions', 'alert-circle', 3),
  ('Reference', 'Technical reference and detailed guides', 'book-open', 4),
  ('Tips', 'Best practices and optimization tips', 'lightbulb', 5);

-- Verify the setup
SELECT 'Schema setup complete!' as message;
SELECT 'Categories created: ' || count(*)::text as categories FROM categories;
SELECT 'Tables with RLS enabled: ' || count(*)::text as rls_tables 
FROM pg_class c 
JOIN pg_namespace n ON n.oid = c.relnamespace 
WHERE n.nspname = 'public' 
AND c.relname IN ('categories', 'help_articles', 'help_analytics') 
AND c.relrowsecurity = true;
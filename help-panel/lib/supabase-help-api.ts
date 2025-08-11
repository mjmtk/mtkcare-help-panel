import { createClient } from '@supabase/supabase-js'
import type { HelpContent, HelpSearchParams, HelpAnalytics } from '../types/help'

export class SupabaseHelpAPI {
  private supabase
  
  constructor(config: { url: string; anonKey: string }) {
    this.supabase = createClient(config.url, config.anonKey)
  }

  async getHelpContent(params?: HelpSearchParams): Promise<HelpContent[]> {
    let query = this.supabase
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
      // Full-text search using the search_vector
      query = query.textSearch('search_vector', params.query)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50) // Reasonable limit for help content

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Failed to fetch help content: ${error.message}`)
    }

    // Transform data to match HelpContent interface
    return (data || []).map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.categories?.name || 'General',
      tags: article.tags || [],
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      viewCount: article.view_count || 0
    }))
  }

  async getHelpTopic(id: string): Promise<HelpContent | null> {
    const { data, error } = await this.supabase
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

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Supabase query error:', error)
      throw new Error(`Failed to fetch help topic: ${error.message}`)
    }

    // Transform to HelpContent interface
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.categories?.name || 'General',
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      viewCount: data.view_count || 0
    }
  }

  async trackAnalytics(analytics: Omit<HelpAnalytics, 'timestamp'>) {
    try {
      const { error } = await this.supabase
        .from('help_analytics')
        .insert({
          article_id: analytics.topicId,
          action: analytics.action,
          context: analytics.context || null,
          session_hash: analytics.sessionHash || null,
          timestamp: new Date().toISOString()
        })

      if (error) {
        console.error('Analytics tracking error:', error)
        // Don't throw - analytics failures shouldn't break the app
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  async getPopularTopics(): Promise<HelpContent[]> {
    const { data, error } = await this.supabase
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

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Failed to fetch popular topics: ${error.message}`)
    }

    // Transform data to match HelpContent interface
    return (data || []).map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.categories?.name || 'General',
      tags: article.tags || [],
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      viewCount: article.view_count || 0
    }))
  }

  async incrementViewCount(articleId: string) {
    try {
      const { error } = await this.supabase
        .rpc('increment_view_count', { article_id: articleId })

      if (error) {
        console.error('View count increment error:', error)
      }
    } catch (error) {
      console.error('View count increment error:', error)
    }
  }
}